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
from pyodide.ffi.wrappers import add_event_listener


# get html objects
#   sliders
slider_pv = document.getElementById("PV-Eingabe")
slider_windC = document.getElementById("WKA_OnShore-Eingabe")
slider_windO = document.getElementById("WKA_OffShore-Eingabe")
slider_electrolysis = document.getElementById("Elektrolyseur-Eingabe")
#   output boxes
energy_input = document.getElementById("en_zu")
water_input = document.getElementById("h2o")
h2_output = document.getElementById("h2")
h2_lhv_output = document.getElementById("h2_lhv")
h2_hhv_output = document.getElementById("h2_hhv")
o2_output = document.getElementById("o2")
heat_output = document.getElementById("heatSTACK")
vlh_operation = document.getElementById("vlh_ele")


# define Path for base data
url = ("http://127.0.0.1:5500/erz_data.csv")

# read base data
gen_data = pd.read_csv(open_url(url), delimiter=';')

# generate base generation profiles
pv_base = gen_data['PV'].to_numpy(dtype='float64')
windC_base = gen_data['Wind Coast'].to_numpy(dtype='float64')
windO_base = gen_data['Wind Offshore'].to_numpy(dtype='float64')

# set base values for plot
amt_cars = 5000
amt_busses = 5000
amt_wasteheat = 4000
amt_h2heat= 3000
m_fe = 4300

async def update_results(event):
    
    # get current slider and dropdown values
    p_pv = float(slider_pv.value)
    p_windC = float(slider_windC.value)
    p_windO = float(slider_windO.value)
    p_electrolysis = float(slider_electrolysis.value)
    
    # drop down values for electrolysis efficiency
    n_pem = 0.62
    n_pem_heat = 0.20
    
    # define constants
    hu_h2 = 33.33 # MWh/t
    ho_h2 = 39.41 #MWh/t
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
    used_energy = used_power.sum() # MWh

    # calculate VLH (Volllaststunden)
    vlh = used_energy / p_electrolysis # h


    # calculate outputs
    # mass hydrogen
    m_h2 = (used_energy * n_pem) / hu_h2 # t
    
    # heat
    heat_stack = (used_energy * n_pem_heat) # MWh
    
    # calculation energy in H2 LHV and HHV
    h2_lhv = m_h2 * hu_h2 # MWh
    h2_hhv = m_h2 * ho_h2 # MWh

    # calculate water demand
    v_h2o = ((16 * m_h2) * 1000) / density_h2o # m³
    
    # mass oxygen
    m_o2 = 8 * m_h2 # t
    
    # factors for graphic 
    consumption_car = 1.2  # kg H2 / 100km
    consumption_bus = 6 # kg H2 / 100 km  
    consumption_house = 15 * 120 # kWh pro haus (KfW40 Haus 15kWh/m² Annahme: 120m²)

    # amounts supplied
    # mass Roheisen
    m_fe = m_h2 * 28 # t
    # cars
    amt_cars = (m_h2 * 1000) / consumption_car
    # busses
    amt_busses = (m_h2 * 1000) / consumption_bus
    # amount house heating by wasteheat
    amt_wasteheat = (heat_stack * 1000) / consumption_house
    # amount house heating by heat from H2
    amt_h2heat = (h2_hhv * 1000) / consumption_house
    
    # write results on page
    energy_input.value = str(int(used_energy))
    water_input.value = str(int(v_h2o))
    h2_output.value = str(int(m_h2))
    h2_lhv_output.value = str(int(h2_lhv))
    h2_hhv_output.value = str(int(h2_hhv))
    o2_output.value = str(int(m_o2))
    heat_output.value = str(int(heat_stack))
    vlh_operation.value = str(int(vlh))
        
    await asyncio.sleep(.1)
    
    

# create proxy function
#update_res = create_proxy(update_results)

# define EventListeners and update results
add_event_listener(slider_pv, "input", update_results)
add_event_listener(slider_windC, "input", update_results)
add_event_listener(slider_windO, "input", update_results)
add_event_listener(slider_electrolysis, "input", update_results)
