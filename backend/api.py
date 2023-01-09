from typing import Union
import pandas as pd
from fastapi import FastAPI, File, UploadFile
from io import StringIO, BytesIO
from model import HandleEquation
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# origins = [
    # "http://localhost:3000",
    # "localhost:3000",
    # 'https://5f57-113-190-235-106.ap.ngrok.io/'
# ]
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/ec50-cal/")
async def create_upload_file(file: UploadFile = File(...)):
    print(file)
    name  = file.filename.split('.')[-1]
    if name == 'xlsx' or name == 'xls' or name == 'xltm':
        sheet =  file.file.read()
        try:
            xls = pd.ExcelFile(BytesIO(sheet))
            data = xls.parse(0)
            Kml = xls.parse(1)
            # data=pd.read_excel(BytesIO(sheet))
            # Kml=pd.read_excel(BytesIO(sheet), sheet_name='f' )
            R2_max, f_max, f_list, R2 = HandleEquation(data, Kml)
            return {'status':200, 'r2_max': R2_max, 'f_max':f_max, 'f_list':f_list, 'r2':R2}
        except Exception:
            return {'status': 502, 'message':'Wrong structure in excel file' }
    
    else: return {'status': 502, 'message': 'Wrong format!!!' }