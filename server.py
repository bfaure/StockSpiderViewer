
from flask import Flask,request 
from flask_restful import Resource,Api
from json import dumps
from flask_jsonpify import jsonify
from os import system,remove

from paramiko import SSHClient
from scp import SCPClient

app=Flask(__name__)
api=Api(app)
server_password=None # password of device running StockSpider
server_ip='192.168.1.17' # ip where StockSpider is currently running 
server_user='pi' # username of device running StockSpider 
server_path='/home/pi/Desktop/StockSpider' # path where StockSpider is installed on server
scp=None # client interface to remote server

class StockData(Resource):
    def get(self,ticker): 
        print("Copying file from server...")
        scp.get('%s/data/%s.tsv'%(server_path,ticker),'%s.tsv'%ticker)
        datetimes,prices=[],[]
        with open('%s.tsv'%(ticker),'r') as f:
            lines=f.read().split("\n")
            for line in lines:
                items=line.split("\t")
                if len(items)==2 and items[0]!='Datetime':
                    datetimes.append(items[0])
                    prices.append(items[1].strip())
        remove('%s.tsv'%ticker)
        response=jsonify({'data':{'datetime':datetimes,'price':prices}})
        response.headers.add('Access-Control-Allow-Origin','*')
        return response

api.add_resource(StockData,'/stock/<ticker>')

if __name__=='__main__':
    server_password=input("Enter server password: ")
    ssh = SSHClient()
    ssh.load_system_host_keys()
    ssh.connect(server_ip,port=22,username=server_user,password=server_password)
    scp = SCPClient(ssh.get_transport())
    app.run(port='5002',host='0.0.0.0')