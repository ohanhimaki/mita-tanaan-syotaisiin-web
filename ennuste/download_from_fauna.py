from faunadb import query as q
from faunadb.client import FaunaClient

import variables as variables
from turn_fauna_lunch_list_to_dict import turn_fauna_lunch_list_to_dict


def download_from_fauna():

    # Initialize Fauna client
    client = FaunaClient(secret=variables.YOUR_FAUNA_SECRET_KEY)

    # Query the FaunaDB collection variables.YOUR_FAUNA_COLLECTION_NAME
    result = client.query(
      q.map_(
        lambda x: q.get(x),
        q.paginate(q.match(q.index('all_LunchLists')), 100000)
      )
    )

    df = turn_fauna_lunch_list_to_dict(result['data'], 'download_from_fauna')
    df.to_csv('output.csv', index=False)


download_from_fauna()
