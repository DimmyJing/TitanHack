from fastai.vision import (get_transforms, ImageDataBunch,
                           cnn_learner, models, open_image)
from flask_cors import CORS, cross_origin
from fastai.metrics import error_rate
from html.parser import HTMLParser
from flask import Flask, request
from pathlib import Path
from io import BytesIO
import requests
import base64
import os


app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)
cross_origin_args = {'origin': '*', 'headers': ['Content-Type']}


addresses = []
valid_address = True


class MyHTMLParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        global valid_address
        valid_address = (len(attrs) == 1 and len(attrs[0]) == 2
                         and attrs[0][1] == "address1")

    def handle_data(self, data):
        if valid_address:
            data = ''.join(data.strip().split("ï»¿"))
            if data:
                addresses.append(data)


parser = MyHTMLParser()

path = Path(os.getcwd()) / "data"

tfms = get_transforms(do_flip=True, flip_vert=True)
data = ImageDataBunch.from_folder(path, test="test", ds_tfms=tfms, bs=16)

learn = cnn_learner(data, models.resnet34, metrics=error_rate)
learn.load("model_20")

classes = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']


def predict(img):
    res = str(learn.predict(img)[0])
    print(res)
    return res


@app.route("/predictimage", methods=['POST'])
@cross_origin(**cross_origin_args)
def predict_image():
    return predict(open_image(BytesIO(base64.decodebytes(
        request.data.split(b',')[1]))))


# longitude:latitude:material
@app.route("/getnearestdisposal/<coor>", methods=['GET'])
@cross_origin(**cross_origin_args)
def get_disposal(coor):
    global addresses
    addresses = []
    longitude, latitude, material = coor.split(':')
    url = ("https://search.earth911.com/"
           f"?what={material}"
           "&list_filter=location"
           "&max_distance=25"
           f"&latitude={latitude}"
           f"&longitude={longitude}")
    resp = requests.get(url).text
    parser.feed(resp)
    print("ADDRESS: " + addresses[0])
    return addresses[0]


if __name__ == '__main__':
    app.run(host='0.0.0.0')
