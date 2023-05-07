import pickle

# check if model.pkl exists
# if not, run PreProcessData.py
import os.path

import CleanData
import downloadFromFauna

if not os.path.isfile('model.pkl'):
    print("model.pkl not found, run PreProcessData.py")
    exit()
else:
    print("model.pkl found, running makePredictions.py")

# Load the model from file
with open('model.pkl', 'rb') as file:
    model = pickle.load(file)

# load data from fauna
import pandas as pd
from faunadb import query as q
from faunadb.client import FaunaClient

import variables as vars


# Initialize Fauna client
client = FaunaClient(secret=vars.YOUR_FAUNA_SECRET_KEY)

# Query the FaunaDB index lunchlists_refs_by_date, call with parameters '20230501', '20230505'
result = client.query(
  q.call('lunchListsByDateRange', '20230501', '20230505')
)

df = downloadFromFauna.turnFaunaLunchListToDict(result)
df = CleanData.clean_data(df)

#remove votes from dataframe
df = df.drop(columns=['votes'])

# make predictions
predictions = model.predict(df)

# add predictions to dataframe
df['predictions'] = predictions

# add ref to dataframe from result by index
df['ref'] = [item['ref'].id() for item in result]

# update predictions to fauna
for index, row in df.iterrows():
    client.query(
        q.update(
            q.ref(q.collection('LunchLists'), row['ref']),
            {'data': {'predictions': row['predictions']}}
        )
    )

# print dataframe
print(df)

