import time
import base64
import json
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="AuraMenu Spatial Backend",
    description="FastAPI Service providing JWT Auth, User Registration, Dish Metadata, and Spatial AR Experience Sync",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    passcode: str
    tier: str
    dietary: List[str]
    origins: List[str]

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    tier: str
    avatar: str
    dietaryPreferences: List[str]
    favoriteOrigins: List[str]

class LoginResponse(BaseModel):
    token: str
    user: UserProfile

class DishCustomization(BaseModel):
    spiceAdjustment: int
    extraDips: List[str]
    portionMultiplier: float
    notes: Optional[str] = ""

class SavedExperience(BaseModel):
    id: str
    dishId: str
    savedAt: str
    customizations: DishCustomization
    isFavorite: bool

SAVED_EXPERIENCES: List[dict] = [
    {
        "id": "exp-1",
        "dishId": "mysore-bonda",
        "savedAt": "2026-10-03T14:30:00Z",
        "customizations": {
            "spiceAdjustment": 1,
            "extraDips": ["Gunpowder Podi", "Roasted Coconut Chutney"],
            "portionMultiplier": 1.0,
            "notes": "Extra crispy with coconut chutney drizzle."
        },
        "isFavorite": True
    },
    {
        "id": "exp-2",
        "dishId": "south-thali",
        "savedAt": "2026-10-03T12:00:00Z",
        "customizations": {
            "spiceAdjustment": 0,
            "extraDips": ["Elaneer Payasam Bowl"],
            "portionMultiplier": 1.0,
            "notes": "Imperial brass feast balance."
        },
        "isFavorite": True
    }
]

DISHES_DATABASE = [
    {
        "id": "mysore-bonda",
        "name": "Mysore Bonda",
        "nativeName": "ಮೈಸೂರು ಬೋಂಡಾ",
        "subtitle": "Golden Crisp Urad Spheres with Coconut Coulis",
        "origin": "Mysuru, Karnataka",
        "category": "Starters",
        "spiceLevel": 2,
        "calories": 280,
        "prepTime": "12 min",
        "price": 180,
        "rating": 4.9,
        "reviewsCount": 342,
        "description": "Crisp on the outside, cloud-soft within, these fermented lentil spheres are infused with crushed ginger, fresh green chillies, and crushed black peppercorns.",
        "story": "Originating from the royal kitchens of the Wadiyar dynasty in Mysuru, this teatime classic achieves its signature honeycomb crumb via controlled overnight fermentation.",
        "ingredients": ["Fermented Urad Dal", "Rice Flour", "Crushed Black Pepper", "Curry Leaves", "Fresh Ginger", "Fresh Coconut Chunks", "Asafoetida"],
        "allergens": ["None (Nut-free, Gluten-free option)"],
        "dietary": ["Vegetarian", "Vegan", "Gluten-Free"],
        "arModelType": "mysore_bonda",
        "accentColor": "#f59e0b",
        "gradient": "from-amber-500/20 via-orange-600/10 to-transparent",
        "tags": ["Crispy", "Royal Legacy", "Fermented", "Artisan Fried"],
        "portion": "4 Golden Spheres with Dual Chutneys",
        "steamIntensity": 0.8,
        "textureHighlights": ["Crackling Golden Crust", "Porous Aerated Core", "Velvety Coconut Dip"],
        "pairings": ["Filter Coffee", "Spiced Ginger Tea", "Tender Coconut Cooler"]
    },
    {
        "id": "maddur-vada",
        "name": "Maddur Vada",
        "nativeName": "ಮದ್ದೂರು ವಡೆ",
        "subtitle": "Rustic Crunchy Semolina-Onion Crisps",
        "origin": "Maddur, Mandya District",
        "category": "Starters",
        "spiceLevel": 3,
        "calories": 310,
        "prepTime": "15 min",
        "price": 160,
        "rating": 4.8,
        "reviewsCount": 289,
        "description": "Flaky, coarse-ground semolina disc studded with caramelized shallots, fiery green chillies, and roasted cumin seeds, fried to deep amber perfection.",
        "story": "First created in 1917 at the Maddur railway station for passengers travelling on the Mysore–Bangalore passenger train by Ramachandra Budhya.",
        "ingredients": ["Coarse Rava (Semolina)", "Maida", "Rice Flour", "Sliced Shallots", "Cumin Seeds", "Curry Leaves", "Pure Clarified Butter"],
        "allergens": ["Wheat / Gluten"],
        "dietary": ["Vegetarian"],
        "arModelType": "maddur_vada",
        "accentColor": "#ea580c",
        "gradient": "from-orange-500/20 via-red-600/10 to-transparent",
        "tags": ["Heritage Crunch", "Caramelized Onion", "Mandya Legend"],
        "portion": "3 Large Crispy Discs with Roasted Chutney",
        "steamIntensity": 0.6,
        "textureHighlights": ["Shattering Edge Crisp", "Rich Roasted Cumin Aroma", "Sweet Caramelized Onion Notes"],
        "pairings": ["Degree Filter Kaapi", "Masala Buttermilk", "Badam Milk"]
    },
    {
        "id": "paneer-pakoda",
        "name": "Paneer Pakoda",
        "nativeName": "पनीर पकोड़ा",
        "subtitle": "Herb-Stuffed Malai Cottage Fritters",
        "origin": "Amritsar, Punjab",
        "category": "Starters",
        "spiceLevel": 2,
        "calories": 340,
        "prepTime": "10 min",
        "price": 220,
        "rating": 4.9,
        "reviewsCount": 415,
        "description": "Pillowy cubes of fresh buffalo milk paneer sandwiched with spicy mint-coriander chutney, draped in spiced gram flour batter, and flash-fried crisp.",
        "story": "A staple of North Indian monsoon afternoons, elevated here with dual chutney layering and smoked black salt sprinkle.",
        "ingredients": ["Fresh Malai Paneer", "Gram Flour (Besan)", "Pudina-Dhaniya Chutney", "Ajwain (Carom Seeds)", "Smoked Chaat Masala", "Kashmiri Chilli"],
        "allergens": ["Dairy"],
        "dietary": ["Vegetarian", "Gluten-Free"],
        "arModelType": "paneer_pakoda",
        "accentColor": "#eab308",
        "gradient": "from-yellow-500/20 via-amber-600/10 to-transparent",
        "tags": ["Melt-in-Mouth", "Mint Infused", "Monsoon Favorite"],
        "portion": "6 Large Stuffed Fritters with Mint Chutney & Radish Slaw",
        "steamIntensity": 0.9,
        "textureHighlights": ["Crispy Golden Coating", "Juicy Velvet Paneer Heart", "Zesty Mint Chutney Layer"],
        "pairings": ["Karak Masala Chai", "Mango Lassi", "Pomegranate Fizz"]
    },
    {
        "id": "south-thali",
        "name": "Royal Dakshin Thali",
        "nativeName": "ರಾಜ ಭೋಜನ ತಾಲಿ",
        "subtitle": "Grand Brass Platter of 9 Imperial Delicacies",
        "origin": "Thanjavur & Udupi Traditions",
        "category": "Platters",
        "spiceLevel": 3,
        "calories": 680,
        "prepTime": "20 min",
        "price": 450,
        "rating": 5.0,
        "reviewsCount": 620,
        "description": "An emperor’s feast served in heavy handcrafted bell-metal katoris: heirloom Sona Masoori rice, Drumstick Sambar, Pepper Rasam, Ash Gourd Kootu, Raw Mango Thokku, Crisp Papadum, and Elaneer Payasam.",
        "story": "Designed under ancient Ayurvedic principles incorporating all six tastes (Shadrasa) for digestive harmony.",
        "ingredients": ["Hand-pounded Sona Masoori Rice", "Tuvar Dal", "Moringa (Drumstick)", "Tamarind Pulp", "Coconut Milk", "Ghee", "Gunpowder Podi"],
        "allergens": ["Dairy (optional ghee separate)"],
        "dietary": ["Vegetarian", "Jain-Friendly", "Gluten-Free"],
        "arModelType": "south_thali",
        "accentColor": "#10b981",
        "gradient": "from-emerald-500/20 via-teal-600/10 to-transparent",
        "tags": ["Royal Feast", "Shadrasa Balance", "Brass Platter", "9 Courses"],
        "portion": "Complete Grand Platter for 1-2 Persons",
        "steamIntensity": 1.0,
        "textureHighlights": ["Glistening Clarified Butter", "Simmering Broths", "Crunchy Sun-Dried Crisps"],
        "pairings": ["Neer Mor (Spiced Buttermilk)", "Kokum Sharbat", "Jaggery Filter Coffee"]
    }
]

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "AuraMenu – Culinary Reality Backend",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.post("/api/auth/login", response_model=LoginResponse)
def login(request: LoginRequest):
    tier = "Chef Patron" if "chef" in request.username.lower() else "Culinary Connoisseur"
    
    payload = {
        "sub": request.username,
        "tier": tier,
        "iat": int(time.time()),
        "exp": int(time.time()) + 86400
    }
    encoded_payload = base64.b64encode(json.dumps(payload).encode()).decode()
    jwt_token = f"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.{encoded_payload}.auramenu_signature_live"

    user = UserProfile(
        id=f"usr-{request.username.lower()}",
        name=request.username.title(),
        email=f"{request.username.lower()}@auramenu.io",
        tier=tier,
        avatar=f"https://api.dicebear.com/7.x/bottts/svg?seed={request.username}",
        dietaryPreferences=["Vegetarian"],
        favoriteOrigins=["Mysuru, Karnataka", "Amritsar, Punjab"]
    )

    return LoginResponse(token=jwt_token, user=user)

@app.post("/api/auth/register", response_model=LoginResponse)
def register(request: RegisterRequest):
    payload = {
        "sub": request.email,
        "name": request.name,
        "tier": request.tier,
        "dietary": request.dietary,
        "iat": int(time.time()),
        "exp": int(time.time()) + 86400 * 7
    }
    encoded_payload = base64.b64encode(json.dumps(payload).encode()).decode()
    jwt_token = f"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.{encoded_payload}.auramenu_vip_signature_live"

    user = UserProfile(
        id=f"usr-{request.email.split('@')[0]}",
        name=request.name,
        email=request.email,
        tier=request.tier,
        avatar=f"https://api.dicebear.com/7.x/bottts/svg?seed={request.name}",
        dietaryPreferences=request.dietary,
        favoriteOrigins=request.origins
    )

    return LoginResponse(token=jwt_token, user=user)

@app.get("/api/dishes")
def get_dishes():
    return DISHES_DATABASE

@app.get("/api/experiences/saved")
def get_saved_experiences():
    return SAVED_EXPERIENCES

@app.post("/api/experiences/save")
def save_experience(exp: SavedExperience):
    SAVED_EXPERIENCES.insert(0, exp.dict())
    return {"status": "saved", "id": exp.id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
