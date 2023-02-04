# -*- coding: utf-8 -*-
"""
Created on Fri Feb  3 13:42:22 2023

@author: Marvin Brands
"""

import numpy as np
import pandas as pd
import os
#from js import document
#from pyodide import create_proxy

DATASOURCEPATH = os.path.dirname(os.path.abspath(__file__)) + '\erz_data.csv'

# define constants
hu_h2 = 33.33 # MWh/t


# read base data
gen_data = pd.read_csv(DATASOURCEPATH, delimiter=';')

# generate base generation profiles
pv_base = gen_data['PV'].to_numpy(dtype='float64')
windC_base = gen_data['Wind Coast'].to_numpy(dtype='float64')
windO_base = gen_data['Wind Offshore'].to_numpy(dtype='float64')

# get current slider values
p_pv = 1
p_windC = 0
p_windO = 2
p_electrolysis = 0.5

# drop down values for electrolysis efficiency
n_pem = 0.62
n_ael = 0.55
n_soc = 0.65



# scale generation profiles
pv_scaled = pv_base * p_pv
windC_scaled = windC_base * p_windC
windO_scaled = windO_base * p_windO
gen_combined = pv_scaled + windC_scaled + windO_scaled

# calculate output values
# operational power of electrolyzer
used_power = np.empty([1,0])
for i in range(0, len(gen_combined)):
    if gen_combined[i] <= p_electrolysis:
        used_power = np.append(used_power, gen_combined[i])
    else:
        used_power = np.append(used_power, p_electrolysis)
        
# energy used by the electrolyzer
used_energy = used_power.sum()

# calculate VLH (Volllaststunden)
vlh = used_energy / p_electrolysis

# choose electrolysis type efficiency and calculate hydrogen mass
electrolysis_type = "pem"
if electrolysis_type == "soc":
    eff = n_soc
    m_h2 = (used_energy * eff) / hu_h2
    # heat = ??????
    # WERT FÜR WÄRME NOCH ERRECHNEN!!!!
elif electrolysis_type == "ael":
    eff = n_ael
    m_h2 = (used_energy * eff) / hu_h2
    # heat = ??????
    # WERT FÜR WÄRME NOCH ERRECHNEN!!!!
else:
    eff = n_pem
    m_h2 = (used_energy * eff) / hu_h2
    # heat = ??????
    # WERT FÜR WÄRME NOCH ERRECHNEN!!!!

# calculate water demand
m_h2o = 9 * m_h2
m_o2 = 0.5 * m_h2



# calculate graphics  
range_car = 1.2  # kg H2 / 100km
range_bus = 6 # kg H2 / 100 km  
demand_house = 15 * 120 # kWh pro haus (KfW40 Haus 15kWh/m² Annahme: 120m²)

# equivalent to X km per Car/Bus or X Amount of house heating
km_car = (m_h2 * 1000) / range_car
km_bus = (m_h2 * 1000) / range_bus
amount_house = (m_h2 * hu_h2 * 1000) / demand_house # WÄRMEBEREITSTELLUNG AUS ERZEUGTEM WASSERSTOFF ODER AUS ABWÄRME DER ELEKTROLYSE???

# factors how many km represent one pictogram for cars/busses/houses
factor_cars = 1500
factor_bus = 800
factor_house = 150

eq_cars = int(km_car / factor_cars)
eq_busses = int(km_bus / factor_bus)
eq_house = int(amount_house / factor_house)


output = {
    'genutzte Energie [MWh]' : round(used_energy, 0),
    'Volllaststunden' : round(vlh, 0),
    'Wasserbedarf [kg]' : round(m_h2o, 0),
    'erzeugte Menge Wasserstoff [t]' : round(m_h2, 0),
    'erzeugte Menge Sauerstoff [t]' : round(m_o2, 0)
    # heat = ??????
    # WERT FÜR WÄRME NOCH ERRECHNEN!!!!
    }

print(output)





# erzeugung test
#pv = pv_scaled.sum()
#windC = windC_scaled.sum()
#windO = windO_scaled.sum()
#comb = gen_combined.sum()


