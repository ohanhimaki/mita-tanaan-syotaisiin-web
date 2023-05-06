﻿import pickle

# check if model.pkl exists
# if not, run PreProcessData.py
import os.path

import CleanData

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

# {
#   name: "lunchlists_refs_by_date",
#   serialized: true,
#   source: "LunchLists",
#   values: [
#     {
#       field: ["data", "date"]
#     },
#     {
#       field: ["ref"]
#     }
#   ]
# }

# use index to get all refs by date

# Initialize Fauna client
client = FaunaClient(secret=vars.YOUR_FAUNA_SECRET_KEY)

# Query the FaunaDB index lunchlists_refs_by_date, call with parameters '20230501', '20230505'
result = client.query(
  q.call('lunchListsByDateRange', '20230501', '20230505')
)
# result = client.query(
#   q.map_(
#     lambda x: q.get(x),
#     q.paginate(q.match(q.index('all_LunchLists')), 10)
#   )
# )
# print(result)
# exit()

# without index
df = pd.DataFrame.from_dict([item['data'] for item in result])


df = df[['date', 'restaurantData', 'dayData', 'votes']]
# if votes empty, set it to 0
df['votes'] = df['votes'].fillna(0)
# if votes more than 5 set it to 5
df['votes'] = df['votes'].apply(lambda x: 5 if x > 5 else x)
# drop rows without restaurantData.ravintolaid field
df = df.dropna(subset=['restaurantData'])
# Pick restaurantData.ravintolaid to ravintolaid field and drop restaurantdata
df['nimi'] = df['restaurantData'].apply(lambda x: x['nimi'])
# drop restaurantData field
df = df.drop(columns=['restaurantData'])

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
