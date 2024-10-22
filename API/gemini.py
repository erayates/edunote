from fastapi import FastAPI
    
app = FastAPI()

@app.get("/")
async def read_root():
    return {
        "message": "",
        "description": "",
        "endpoints": {
            "/api/scrape": {
                "method": "GET",
                "description": ""
            }
        },
        "see project": "https://github.com/elymsyr/btk-hackathon-24",
        "license": "GNU GENERAL PUBLIC LICENSE"
    }
