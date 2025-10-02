from fastapi import FastAPI, APIRouter, HTTPException, Query
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import aiohttp
import aiofiles


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Geometry Dash Mod Browser", description="Browse and download Geometry Dash mods")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Create downloads directory
DOWNLOADS_DIR = ROOT_DIR / "downloads"
DOWNLOADS_DIR.mkdir(exist_ok=True)

# Define Models
class Mod(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    author: str
    version: str
    category: str
    tags: List[str] = []
    download_url: str
    file_size: Optional[str] = None
    screenshots: List[str] = []
    compatibility: List[str] = []  # GD versions
    rating: float = 0.0
    downloads_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ModCreate(BaseModel):
    name: str
    description: str
    author: str
    version: str
    category: str
    tags: List[str] = []
    download_url: str
    file_size: Optional[str] = None
    screenshots: List[str] = []
    compatibility: List[str] = []

class ModFilter(BaseModel):
    category: Optional[str] = None
    author: Optional[str] = None
    search: Optional[str] = None
    tags: Optional[List[str]] = None

class UserCollection(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    mod_ids: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {
        "message": "Geometry Dash Mod Browser API", 
        "version": "1.0",
        "endpoints": {
            "mods": "/api/mods",
            "categories": "/api/categories",
            "search": "/api/mods/search"
        }
    }

# Mod Management Endpoints
@api_router.get("/mods", response_model=List[Mod])
async def get_mods(
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(50, le=100),
    offset: int = 0
):
    """Get all mods with optional filtering"""
    query = {}
    
    if category:
        query["category"] = category
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"author": {"$regex": search, "$options": "i"}}
        ]
    
    mods = await db.mods.find(query).skip(offset).limit(limit).to_list(limit)
    return [Mod(**mod) for mod in mods]

@api_router.get("/mods/{mod_id}", response_model=Mod)
async def get_mod(mod_id: str):
    """Get a specific mod by ID"""
    mod = await db.mods.find_one({"id": mod_id})
    if not mod:
        raise HTTPException(status_code=404, detail="Mod not found")
    return Mod(**mod)

@api_router.post("/mods", response_model=Mod)
async def create_mod(mod_data: ModCreate):
    """Create a new mod entry"""
    mod = Mod(**mod_data.dict())
    await db.mods.insert_one(mod.dict())
    return mod

@api_router.get("/categories")
async def get_categories():
    """Get all available mod categories"""
    categories = await db.mods.distinct("category")
    return {"categories": categories}

@api_router.post("/mods/{mod_id}/download")
async def download_mod(mod_id: str):
    """Increment download count and return download info"""
    mod = await db.mods.find_one({"id": mod_id})
    if not mod:
        raise HTTPException(status_code=404, detail="Mod not found")
    
    # Increment download count
    await db.mods.update_one(
        {"id": mod_id}, 
        {"$inc": {"downloads_count": 1}}
    )
    
    return {
        "download_url": mod["download_url"],
        "filename": f"{mod['name']}-{mod['version']}.geode",
        "instructions": "Install using Geode mod loader"
    }

@api_router.get("/mods/featured")
async def get_featured_mods():
    """Get featured/popular mods"""
    mods = await db.mods.find().sort("downloads_count", -1).limit(10).to_list(10)
    return [Mod(**mod) for mod in mods]

@api_router.get("/stats")
async def get_stats():
    """Get platform statistics"""
    total_mods = await db.mods.count_documents({})
    total_downloads = await db.mods.aggregate([
        {"$group": {"_id": None, "total": {"$sum": "$downloads_count"}}}
    ]).to_list(1)
    
    categories_count = len(await db.mods.distinct("category"))
    
    return {
        "total_mods": total_mods,
        "total_downloads": total_downloads[0]["total"] if total_downloads else 0,
        "categories_count": categories_count
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
