import numpy as np
import math
import pandas as pd
from sklearn.metrics import r2_score

def Cal_EC( F50_pbBL,Kbl,Ion):
    ListEC50 = []
    for i in range(len(Ion['Ca'])):
        EC50_Pb = F50_pbBL * (1 + Kbl['KCaBL'] * Ion['Ca'][i]*math.pow(10, 3)  + Kbl['KMgBL'] * Ion['Mg'][i]*math.pow(10, 3) + Kbl['KNaBL'] * Ion['Na'][i]*math.pow(10, 3) + Kbl['KHBL'] * Ion['H'][i]*math.pow(10, 7) + Kbl['KKBL'] * Ion['K'][i]*math.pow(10, 3)) / ((1 - F50_pbBL) * Kbl['KPbBL'])
        ListEC50.append(EC50_Pb)
    return ListEC50

def validate(data):
    nan_value = float("NaN")
    data.replace("", nan_value, inplace=True)
    data.dropna(inplace=True)
    return data

def evaluate_model (actual, model):
    mape = np.mean(np.abs(model - actual) / np.abs(actual))
    mse = np.mean((model - actual) ** 2) ** .5  # Variance
    rmse = np.sqrt(mse)  # Standard deviation
    R2 = r2_score(actual, model)
    print('The Mape', mape)
    print('The Mean Squared Error  :{}'.format(round(mse, 2)))
    print('The RMSE  :{}'.format(round(rmse, 2)))
    print('The R2  : {}'.format(round(R2, 2)))
    return [mape,mse,rmse,R2]

def HandleEquation (data, Kml):
    # data=  pd.read_excel ('./data/EC50.xlsx')
    # Kml=  pd.read_excel ('./data/EC50.xlsx', sheet_name='f')
    f =  np.arange( 0.3, 0.5, 0.001)
    # Kbl
    Kbl = {
        'KCaBL' : pd.DataFrame(Kml, columns=['KCaBL']).values[0][0],
        'KMgBL' : pd.DataFrame(Kml, columns=['KMgBL']).values[0][0],
        'KNaBL' : pd.DataFrame(Kml, columns=['KNaBL']).values[0][0],
        'KKBL' : pd.DataFrame(Kml, columns=['KKBL']).values[0][0],
        'KHBL' : pd.DataFrame(Kml, columns=['KHBL']).values[0][0],
        'KPbBL' : pd.DataFrame(Kml, columns=['KPbBL']).values[0][0],
    }
    # Ion
    Ion = {
    'Ca' : pd.DataFrame(data, columns=['Ca']).values,
    'Mg' : pd.DataFrame(data, columns=['Mg']).values,
    'Na' : pd.DataFrame(data, columns=['Na']).values,
    'K' : pd.DataFrame(data, columns=['K']).values,
    'H' : pd.DataFrame(data, columns=['H']).values
    }
    print (Kml)
    print('#########################')
    print (data)
    #EC50 pratice
    EC50 = pd.DataFrame(data,columns=['EC50'])
    EC50 = EC50.to_numpy()
    ListData = []
    R2 = []
    for x in range(len(f)):
        f50 = f[x]
        ListData.append(Cal_EC(f50, Kbl, Ion))

    # f
    f_fix = []
    for i in range(len(ListData)):
        r2 = r2_score(EC50,ListData[i])
        if(r2>=0):
            R2.append(r2)
            f_fix.append(round(f[i],4))

    print('----------------------Evaluate Model--------------------------------')
    print ("Max R2 :", round(max(R2),4))
    max_index = R2.index(max(R2))
    print ("f____",round(f_fix[max_index],4))
    return  round(max(R2),4), round(f_fix[max_index],4), f_fix, R2 # R2 max, f_max, f_list, R2



