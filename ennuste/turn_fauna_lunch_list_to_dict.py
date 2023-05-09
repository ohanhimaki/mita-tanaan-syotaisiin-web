import pandas as pd


def turn_fauna_lunch_list_to_dict(lunchlists, text):

    print(text)
    df = pd.DataFrame.from_dict([item['data'] for item in lunchlists])

    # print 5 first rows of lunchlists
    for item in lunchlists[:1]:
        print(item['ref'])




    # make new dataframe with date, restaurantData.ravintolaid, dayData, votes
    df = df[['date', 'restaurantData', 'dayData', 'votes']]
    # add id from ref to dataframe
    df['id'] = [item['ref'].id() for item in lunchlists]
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
    return df
