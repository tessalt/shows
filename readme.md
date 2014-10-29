- create secrets.json
- npm install
- geddy jake db:init
- geddy jake db:migrate

to compile assets

## To run app

1. Create secrets.json file in /config

    {
      "passport": {
        "successRedirect": "/",
        "failureRedirect": "/login",
        "twitter": {
          "consumerKey": XXXX
          "consumerSecret": XXXXXX
        },
        "facebook": {
          "clientID": XXXXX
          "clientSecret": XXXXX
        },
        "adminId": XXXXX
      },
      "secret": XXXXX
    }

2. `npm install`
3. `geddy jake db:init`
4. `geddy jake db:migrate`
5. `geddy`
6. Open to localhost:3000

## To compile client-side assets

`gulp styles`
`gulp templates` (for .hbs files)
`gulp scripts`
`gulp watch`
