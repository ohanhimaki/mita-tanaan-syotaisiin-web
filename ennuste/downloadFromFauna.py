import pandas as pd
from faunadb import query as q
from faunadb.client import FaunaClient

import variables as vars

# Initialize Fauna client
client = FaunaClient(secret=vars.YOUR_FAUNA_SECRET_KEY)

# Query the FaunaDB collection vars.YOUR_FAUNA_COLLECTION_NAME
result = client.query(
  q.map_(
    lambda x: q.get(x),
    q.paginate(q.match(q.index('all_LunchLists')), 100000)
  )
)

df = pd.DataFrame.from_dict([item['data'] for item in result['data']])

# make new dataframe with date, restaurantData.ravintolaid, dayData, votes
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


df.to_csv('output.csv', index=False)


