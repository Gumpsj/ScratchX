#----------------------------------------------------
import time
import serial.tools.list_ports as port_list
import serial
    
#----------------------------------------------------
from flask import Flask, Response, jsonify
app = Flask(__name__)

#----------------------------------------------------
Arduino_VID = "2341"
Rapiro_VID = "0403"

#----------------------------------------------------
ser_rapiro = None  # serial object to the Rapiro
ser_arduino = None # serial object to the Arduino

#----------------------------------------------------
def getArduino():
  for p in port_list.comports():
    p=list(p)
    if Arduino_VID in p[-1]:
      return p[0]
  return None

#----------------------------------------------------
# return the 1st serial port connected to the Rapiro
def getRapiro():
  for p in port_list.comports():
    p=list(p)
    if Rapiro_VID in p[-1]:
      return p[0]
  return None

#----------------------------------------------------
# just say Hello!
@app.route("/")
def hello():
  msg="""
  <h1>serial-port bridge server</h1>
  <h2>
  <br>Commands
  <br>-------------------------------------------------
  <br>/ports  (list all avaliable serial port(s))
  <br>/arduino  (return the 1st arduino found)
  <br>/rapiro  (return the 1st Rapiro found)
  <br>/rapiro/connected (connect to the Rapiro)
  <br>/rapiro/disconnected (disconnect from the Rapiro)
  <br>/rapiro/send/msg (send 'msg' to the Rapiro)
  </h2>
  """
  return msg

#----------------------------------------------------
# list the 1st serial port connected to the Arduino
@app.route("/arduino", methods = ['GET'])
def _getArduino():
  port=getArduino();
  data={'port':port};  
  return jsonify(data)

#----------------------------------------------------
# list the 1st serial port connected to the Rapiro
@app.route("/rapiro", methods = ['GET'])
def _getRapiro():
  port=getRapiro();
  data={'port':port};  
  return jsonify(data)

#----------------------------------------------------
# send a raw string data (msg) to the Rapiro
@app.route("/rapiro/send/<msg>", methods = ['GET'])
def _sendRapiro(msg):
  global ser_rapiro
  if ser_rapiro!=None:
    ser_rapiro.write(msg.encode())
    #print(ser_rapiro.name," : ",msg)         
    return "success"  
  return "error"

#----------------------------------------------------
# connect to the Rapiro
@app.route("/rapiro/connect", methods = ['GET'])
def _connectRapiro():
  global ser_rapiro
  if ser_rapiro!=None:
    ser_rapiro.close()
    ser_rapiro=None
  p=getRapiro()
  if p:
    ser_rapiro = serial.Serial(p,9600)
    #ser_rapiro.write("#M0".encode())
    if ser_rapiro:
      return "success"  
  return "error"

#----------------------------------------------------
# disconnect from the Rapiro
@app.route("/rapiro/disconnect", methods = ['GET'])
def _disconnectRapiro():
  global ser_rapiro
  if ser_rapiro!=None:
    ser_rapiro.write("#M0".encode())
    ser_rapiro.close()
    ser_rapiro=None
  return "success"

#----------------------------------------------------
# list all communication ports available
@app.route("/ports", methods = ['GET'])
def getports():
  ret=""
  for p in port_list.comports():
    p=list(p)
    ret+=p[0]+ " : " + p[-1] + "<br>\n"
  return ret

#----------------------------------------------------
if __name__=='__main__':
  app.run(host="0.0.0.0",port=5000,debug = True)