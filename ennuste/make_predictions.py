import pickle
from datetime import date

# check if model.pkl exists
# if not, run PreProcessData.py
import os.path

import variables
import clean_data
from turn_fauna_lunch_list_to_dict import turn_fauna_lunch_list_to_dict


def make_predictions():

    if not os.path.isfile(variables.MODEL_DIRECTORY + 'model.pkl'):
        print("model.pkl not found, run PreProcessData.py")
        exit()
    else:
        print("model.pkl found, running makePredictions.py")

    # Load the model from file
    with open(variables.MODEL_DIRECTORY + 'model.pkl', 'rb') as file:
        model = pickle.load(file)

    # load data from fauna
    import pandas as pd
    from faunadb import query as q
    from faunadb.client import FaunaClient

    import variables as vars


    # Initialize Fauna client
    client = FaunaClient(secret=vars.YOUR_FAUNA_SECRET_KEY)

    weeksoffset = 0
    today = date.today()

    # add days weekoffset * 7 to today
    tmpDay = today + pd.DateOffset(days=weeksoffset * 7)

    # start date is monday of the week of tmpDay
    start_date = tmpDay - pd.DateOffset(days=tmpDay.weekday())
    # end date is sunday of the week of tmpDay
    end_date = start_date + pd.DateOffset(days=4)


    start_date_string = start_date.strftime('%Y%m%d')
    end_date_string = end_date.strftime('%Y%m%d')

    # get data with yyyymmdd end and start dates
    result = client.query(
      q.call('lunchListsByDateRange', start_date_string, end_date_string)
    )

    df = turn_fauna_lunch_list_to_dict(result, 'make_predictions')

    # order df by nimi and date
    dfCopy = df.copy()

    df = clean_data.clean_data(df)

    #remove votes from dataframe
    df = df.drop(columns=['votes'])

    # make predictions
    predictions = model.predict(df)

    # add predictions to dataframe
    df['predictions'] = predictions

    # add ref to dataframe from dfCopy by index
    df['ref'] = dfCopy['id']
    df['nimi'] = dfCopy['nimi']

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


make_predictions()
