import matplotlib.pyplot as plt
import pandas as pd
import pickle

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

import variables
from clean_data import clean_data
from collections import Counter

DRAWING = True


def preprocess_data():
    data = pd.read_csv('output.csv')

    data = data.dropna()

    # get total votes by nimi
    total_votes = data.groupby('nimi')['votes'].sum().reset_index()

    # save totalvotes to model_TotalVotes.csv
    total_votes.to_csv(variables.MODEL_DIRECTORY + 'model_TotalVotes.csv', index=False)

    # # join all dayData fields to one string
    # replace <br> with space
    data['dayData'] = data['dayData'].str.replace('<br>', ' ')
    #replace "," with space
    data['dayData'] = data['dayData'].str.replace(',', ' ')
    #replace "(" and ")" with space
    data['dayData'] = data['dayData'].str.replace('(', ' ')
    data['dayData'] = data['dayData'].str.replace(')', ' ')
    #regex replace all numbers with space
    data['dayData'] = data['dayData'].str.replace('\d+', ' ')
    #replace asterix with space
    data['dayData'] = data['dayData'].str.replace('*', ' ')

    allDayDatas = ''
    for index, row in data.iterrows():
        allDayDatas += row['dayData']


    words = allDayDatas.split()

    # read blackListedWords.csv
    blackListedWords = pd.read_csv('blackListedWords.csv')

    # remove blacklisted words
    words = [word for word in words if word not in blackListedWords['word'].values]


    most_common_words = Counter(words).most_common(80)

    print(most_common_words)

    # save to csv file, one word per row
    df = pd.DataFrame(most_common_words, columns=['word', 'count'])
    df.to_csv(variables.MODEL_DIRECTORY + 'model_MostCommonWords.csv', index=False)


    if DRAWING:
        # make wordcloud with matplotlib of
        from wordcloud import WordCloud
        import matplotlib.pyplot as plt

        wordsJoined = ' '.join(words)

        wordcloud = WordCloud(width=1600, height=800, max_font_size=200).generate(wordsJoined)
        plt.figure(figsize=(12, 10))
        plt.imshow(wordcloud, interpolation="bilinear")
        plt.axis("off")
        plt.show()

    data = clean_data(data)

    # train model

    X = data.drop(columns=['votes'])
    y = data['votes']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)


    model = RandomForestRegressor(n_estimators=100, max_depth=100, random_state=1)
    model.fit(X_train, y_train)

    if DRAWING:
        # print score
        print(model.score(X_test, y_test))
        # graph feature importance
        feature_importances = pd.Series(model.feature_importances_, index=X.columns)
        feature_importances.nlargest(30).plot(kind='barh')
        plt.show()

    # save model
    pickle.dump(model, open(variables.MODEL_DIRECTORY + 'model.pkl', 'wb'))


preprocess_data()
