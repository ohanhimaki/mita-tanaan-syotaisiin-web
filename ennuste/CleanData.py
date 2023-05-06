import pandas as pd


def clean_data(data):
    # turn date to datetime
    data['date'] = pd.to_datetime(data['date'], format='%Y%m%d')
    data['weekdayint'] = data['date'].dt.weekday
    # drop date
    data = data.drop(columns=['date'])

    # add column for most common words and set 1 if word is in dayData
    most_common_words = pd.read_csv('model_MostCommonWords.csv').values

    for word, count in most_common_words:
        data[word] = data['dayData'].str.contains(word).astype(int)

    # drop dayData
    data = data.drop(columns=['dayData'])

    # add total_votes to data and drop nimi from data to votes total field
    total_votes = pd.read_csv('model_TotalVotes.csv')
    data = pd.merge(data, total_votes, on='nimi')
    data = data.drop(columns=['nimi'])
    data = data.rename(columns={'votes_x': 'votes', 'votes_y': 'votes_total'})

    return data
