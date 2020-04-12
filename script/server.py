from fastai.vision import (get_transforms, ImageDataBunch,
                           cnn_learner, models, open_image)
from flask_cors import CORS, cross_origin
from fastai.metrics import error_rate
from flask import Flask, request
from pathlib import Path
from io import BytesIO
import base64
import os


app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)
cross_origin_args = {'origin': '*', 'headers': ['Content-Type']}


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


if __name__ == '__main__':
    app.run(host='0.0.0.0')
