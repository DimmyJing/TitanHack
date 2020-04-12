from fastai.vision import random, get_transforms, ImageDataBunch, cnn_learner
from fastai.vision import models
from fastai.metrics import error_rate
from pathlib import Path
from glob2 import glob
from sklearn.metrics import confusion_matrix

import pandas as pd
import numpy as np
import os
import zipfile as zf
import shutil
import re
import seaborn as sns
import torch


def split_indices(folder, seed1, seed2):
    n = len(os.listdir(folder))
    full_set = list(range(1, n+1))

    random.seed(seed1)
    train = random.sample(list(range(1, n+1)), int(.5*n))

    remain = list(set(full_set)-set(train))

    random.seed(seed2)
    valid = random.sample(remain, int(.5*len(remain)))
    test = list(set(remain)-set(valid))

    return (train, valid, test)


def get_names(waste_type, indices):
    file_names = [waste_type+str(i)+".jpg" for i in indices]
    return(file_names)


def move_files(source_files, destination_folder):
    for file in source_files:
        shutil.move(file, destination_folder)


subsets = ['train', 'valid']
waste_types = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']

print("Beginning")

for subset in subsets:
    for waste_type in waste_types:
        folder = os.path.join('data', subset, waste_type)
        if not os.path.exists(folder):
            os.makedirs(folder)

if not os.path.exists(os.path.join('data', 'test')):
    os.makedirs(os.path.join('data', 'test'))

print("Maked directories")

for waste_type in waste_types:
    source_folder = os.path.join('dataset-resized', waste_type)
    train_ind, valid_ind, test_ind = split_indices(source_folder, 1, 1)

    train_names = get_names(waste_type, train_ind)
    train_source_files = [os.path.join(source_folder, name)
                          for name in train_names]
    train_dest = "data/train/"+waste_type
    move_files(train_source_files, train_dest)

    valid_names = get_names(waste_type, valid_ind)
    valid_source_files = [os.path.join(source_folder, name)
                          for name in valid_names]
    valid_dest = "data/valid/"+waste_type
    move_files(valid_source_files, valid_dest)

    test_names = get_names(waste_type, test_ind)
    test_source_files = [os.path.join(source_folder, name)
                         for name in test_names]

    move_files(test_source_files, "data/test")

print("Moved files")

path = Path(os.getcwd()) / "data"

tfms = get_transforms(do_flip=True, flip_vert=True)
data = ImageDataBunch.from_folder(path, test="test", ds_tfms=tfms, bs=16)

print("Gotten data")

learn = cnn_learner(data, models.resnet34, metrics=error_rate)

print("Generated CNN")

learn.fit_one_cycle(20, max_lr=5.13e-03)
learn.save("model", return_path=True)

print("Trained")
