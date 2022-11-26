# MitaTanaanSyotaisiin

## Developing

Projektin juuressa aja "netlify dev" komento, komento käynnistää funktiot ja sovelluksen hot reload moodissa.


4. Open app
   Go to [http://localhost:8888]




### Examples

#### Faunadb get by daterange

Tällä hetkellä toimii, tässä indeksi ja funktion koodi



```fql
{
  name: "lunchlists_refs_by_date",
    serialized: true,
    source: "LunchLists",
    values: [
    {
      field: ["data", "date"]
    },
    {
      field: ["ref"]
    }
  ]
}
```

```fql
{
  name: "lunchListsByDateRange",
  role: null,
  body: Query(
    Lambda(
      ["start", "end"],
      Map(
        Select(
          ["data"],
          Paginate(
            Range(
              Match(Index("lunchlists_refs_by_date")),
              Var("start"),
              Var("end")
            )
          )
        ),
        Lambda(["date", "ref"], Get(Var("ref")))
      )
    )
  )
}
```
