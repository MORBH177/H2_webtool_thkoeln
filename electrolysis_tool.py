# -*- coding: utf-8 -*-
"""
Created on Sat Feb  4 15:17:50 2023

@author: Marvin Brands(B.Eng)
"""

import asyncio
import numpy as np
import pandas as pd
from js import document, Element, console
from pyodide import create_proxy
from pyodide.http import open_url

# get html objects
#   sliders
slider_pv = document.getElementById("sl1")
slider_windC = document.getElementById("sl2")
slider_windO = document.getElementById("sl3")
slider_electrolysis = document.getElementById("sl4")
#   dropdown
electrolysis_model = document.getElementById("ele_type")
#   output boxes
energy_input = document.getElementById("en_zu")
water_input = document.getElementById("h2o")
h2_output = document.getElementById("h2")
o2_output = document.getElementById("o2")
heat_output = document.getElementById("heatOUT")
vlh_operation = document.getElementById("vlh_ele")


# define Path for base data
url = ("http://127.0.0.1:5500/erz_data.csv")

async def update_results(event):
    await asyncio.sleep(.1)

    # read base data
    gen_data = pd.read_csv(open_url(url), delimiter=';')

    # generate base generation profiles
    pv_base = gen_data['PV'].to_numpy(dtype='float64')
    windC_base = gen_data['Wind Coast'].to_numpy(dtype='float64')
    windO_base = gen_data['Wind Offshore'].to_numpy(dtype='float64')
    
    
    # get current slider and dropdown values
    p_pv = float(slider_pv.value)
    p_windC = float(slider_windC.value)
    p_windO = float(slider_windO.value)
    p_electrolysis = float(slider_electrolysis.value)
    electrolysis_type = electrolysis_model.value
    
    # drop down values for electrolysis efficiency
    n_pem = 0.62
    n_ael = 0.55
    n_soc = 0.65
    n_pem_heat = 0.90
    n_ael_heat = 0.82
    
    # define constants
    hu_h2 = 33.33 # MWh/t
    density_h2o = 997 # kg/m³
    
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
    if electrolysis_type == "soc":
        eff = n_soc
        m_h2 = (used_energy * eff) / hu_h2
        heat = 0.0
    elif electrolysis_type == "ael":
        eff = n_ael
        m_h2 = (used_energy * eff) / hu_h2
        heat = (used_energy * (n_ael_heat - n_ael))
    elif electrolysis_type == "pem":
        eff = n_pem
        m_h2 = (used_energy * eff) / hu_h2
        heat = (used_energy * (n_pem_heat - n_pem))
    else:
        eff = n_pem
        m_h2 = (used_energy * eff) / hu_h2
        heat = (used_energy * (n_pem_heat - n_pem))


    # calculate water demand
    v_h2o = ((9 * m_h2) * 1000) / density_h2o # m³
    m_o2 = 0.5 * m_h2 # t



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

    
    energy_input.value = str(int(used_energy))
    water_input.value = str(int(v_h2o))
    h2_output.value = str(int(m_h2))
    o2_output.value = str(int(m_o2))
    heat_output.value = str(int(heat))
    vlh_operation.value = str(int(vlh))
    
    

# create proxy function
update_proxy = create_proxy(update_results)

# define EventListeners and update results
pv = slider_pv.addEventListener("input", update_proxy)
windCoast = slider_windC.addEventListener("input", update_proxy)
windOffshore = slider_windO.addEventListener("input", update_proxy)
electrolyze = slider_electrolysis.addEventListener("input", update_proxy)
elec_model = electrolysis_model.addEventListener("change", update_proxy)