﻿import pandas as pd
import variables

UseWeekDay = False
UseUniqueHash = False
UseTotalVotes = True


def clean_data(data):
    if UseWeekDay:
        data['date'] = pd.to_datetime(data['date'], format='%Y%m%d')
        data['weekdayint'] = data['date'].dt.weekday
    data = data.drop(columns=['date'])

    # add column for most common words and set 1 if word is in dayData
    most_common_words = pd.read_csv(variables.MODEL_DIRECTORY + 'model_MostCommonWords.csv').values

    for word, count in most_common_words:
        data[word] = data['dayData'].str.contains(word).astype(int)

    # drop dayData
    data = data.drop(columns=['dayData'])

    # add total_votes to data without changing order of data rows
    if UseTotalVotes:
        total_votes = pd.read_csv(variables.MODEL_DIRECTORY + 'model_TotalVotes.csv')
        data = pd.merge(data, total_votes, on='nimi', how='left')
        data = data.rename(columns={'votes_x': 'votes', 'votes_y': 'votes_total'})

    if UseUniqueHash:
        # make uniquehash column of nimi
        data['uniquehash'] = data['nimi'].apply(lambda x: hash(x))
    data = data.drop(columns=['nimi'])

    # remove id column
    data = data.drop(columns=['id'])

    return data
