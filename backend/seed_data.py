import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Sample Geometry Dash mods data
SAMPLE_MODS = [
    {
        "id": "geome3dash",
        "name": "Geome3Dash",
        "description": "Experience Geometry Dash in stunning 3D! This popular mod transforms the classic 2D gameplay into an immersive 3D experience with enhanced visuals and depth.",
        "author": "TheSillyDoggo",
        "version": "1.2.0",
        "category": "Visual Enhancement",
        "tags": ["3d", "visual", "graphics", "enhancement"],
        "download_url": "https://github.com/TheSillyDoggo/Geome3Dash/releases/download/v1.2.0/geome3dash.geode",
        "file_size": "2.1 MB",
        "screenshots": [
            "https://camo.githubusercontent.com/8f3d9bb8c4b8f8e8f8e8f8e8f8e8f8e8f8e8f8e8/68747470733a2f2f692e696d6775722e636f6d2f4b6a4e7436416e2e706e67"
        ],
        "compatibility": ["2.2", "2.206"],
        "rating": 4.8,
        "downloads_count": 15420
    },
    {
        "id": "betterinfo",
        "name": "BetterInfo",
        "description": "Enhanced information display for Geometry Dash. Shows detailed statistics, level information, and player data with improved UI elements.",
        "author": "cvolton",
        "version": "4.5.1",
        "category": "Interface",
        "tags": ["ui", "stats", "info", "enhancement"],
        "download_url": "https://github.com/cvolton/betterinfo-geode/releases/download/v4.5.1/cvolton.betterinfo.geode",
        "file_size": "1.8 MB",
        "screenshots": [],
        "compatibility": ["2.2", "2.206"],
        "rating": 4.6,
        "downloads_count": 12850
    },
    {
        "id": "gddp-integration",
        "name": "GDDP Integration",
        "description": "Integrates Geometry Dash Demon Progression (GDDP) ratings directly into the game, showing demon difficulty ratings for levels.",
        "author": "Minemaker0430",
        "version": "1.4.2",
        "category": "Gameplay",
        "tags": ["demons", "difficulty", "rating", "integration"],
        "download_url": "https://github.com/Minemaker0430/GDDP-Integration/releases/download/v1.4.2/minemaker0430.gddp_integration.geode",
        "file_size": "850 KB",
        "screenshots": [],
        "compatibility": ["2.2", "2.206"],
        "rating": 4.4,
        "downloads_count": 8750
    },
    {
        "id": "globed2",
        "name": "Globed",
        "description": "Multiplayer mod for Geometry Dash! Play with friends in real-time, see other players' attempts, and compete together.",
        "author": "dankmeme01",
        "version": "1.7.3",
        "category": "Multiplayer",
        "tags": ["multiplayer", "online", "friends", "real-time"],
        "download_url": "https://github.com/dankmeme01/globed2/releases/download/v1.7.3/dankmeme01.globed2.geode",
        "file_size": "3.2 MB",
        "screenshots": [],
        "compatibility": ["2.2", "2.206"],
        "rating": 4.7,
        "downloads_count": 22100
    },
    {
        "id": "noclip",
        "name": "Noclip",
        "description": "Practice mode enhancement that allows you to pass through obstacles. Perfect for learning difficult sections of levels.",
        "author": "spaghettdev",
        "version": "2.1.0",
        "category": "Practice",
        "tags": ["practice", "noclip", "training", "bypass"],
        "download_url": "https://github.com/spaghettdev/noclip-geode/releases/download/v2.1.0/spaghettdev.noclip.geode",
        "file_size": "450 KB",
        "screenshots": [],
        "compatibility": ["2.2", "2.206"],
        "rating": 4.3,
        "downloads_count": 18900
    },
    {
        "id": "click-between-frames",
        "name": "Click Between Frames",
        "description": "Improves input precision by allowing clicks to register between frames, making the game more responsive and fair.",
        "author": "spaghettdev",
        "version": "1.3.1",
        "category": "Performance",
        "tags": ["input", "precision", "performance", "responsiveness"],
        "download_url": "https://github.com/spaghettdev/click-between-frames/releases/download/v1.3.1/spaghettdev.click_between_frames.geode",
        "file_size": "320 KB",
        "screenshots": [],
        "compatibility": ["2.2", "2.206"],
        "rating": 4.9,
        "downloads_count": 31200
    },
    {
        "id": "replay-engine",
        "name": "Replay Engine",
        "description": "Record and replay your Geometry Dash gameplay. Save your best runs, share them with friends, or analyze your performance.",
        "author": "matcool",
        "version": "2.0.4",
        "category": "Recording",
        "tags": ["replay", "recording", "analysis", "sharing"],
        "download_url": "https://github.com/matcool/replay-engine/releases/download/v2.0.4/matcool.replay_engine.geode",
        "file_size": "1.1 MB",
        "screenshots": [],
        "compatibility": ["2.2", "2.206"],
        "rating": 4.5,
        "downloads_count": 9650
    },
    {
        "id": "texture-ldr",
        "name": "Texture Loader",
        "description": "Load custom textures and texture packs for Geometry Dash. Customize the appearance of blocks, backgrounds, and UI elements.",
        "author": "geode-sdk",
        "version": "1.6.0",
        "category": "Customization",
        "tags": ["textures", "customization", "themes", "visual"],
        "download_url": "https://github.com/geode-sdk/texture-loader/releases/download/v1.6.0/geode-sdk.texture_loader.geode",
        "file_size": "750 KB",
        "screenshots": [],
        "compatibility": ["2.2", "2.206"],
        "rating": 4.2,
        "downloads_count": 16800
    }
]

async def seed_database():
    """Seed the database with sample mod data"""
    # MongoDB connection
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    try:
        # Clear existing mods
        await db.mods.delete_many({})
        print("Cleared existing mods...")
        
        # Insert sample mods
        await db.mods.insert_many(SAMPLE_MODS)
        print(f"Inserted {len(SAMPLE_MODS)} sample mods!")
        
        # Print summary
        categories = set(mod["category"] for mod in SAMPLE_MODS)
        total_downloads = sum(mod["downloads_count"] for mod in SAMPLE_MODS)
        
        print(f"Categories: {', '.join(categories)}")
        print(f"Total downloads: {total_downloads:,}")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())