# Commcon Workshop

This is a collection of resources for the first CommCon Workshop

## How to run...

Find a convenient host, note it's external (public) IP. Ensure that inbound TCP traffic to HTTPS (443) and SIP-TLS (5061) is enabled.
```
export TRUNK_TYPE=Simwood
export TRUNK_ACCOUNT=XXXXXXXXXXXXX
export TRUNK_PASSWORD=YYYYYYYYYYYYY
```
Choose passwords and application name for your ARI instance:
```
export ARI_APPLICATION=<application name>
export ARI_USER=<username>
export ARI_PASSWORD=<password>
```


Start the containers:
```
docker-compose up
```

Go to the sample app directory:
```
cd sample-app
```

edit the config file in sample-app, and change the values:
```

  "asterisk": {
    "host": "<server_ip_address>",
    "port": 8080,
    "application": "<application name>",
    "username": "<username>",
    "password": "<password>"
  },
  "deepvoice": {
    "url": "http://<server_internal_ip_address>:9000/synthesize"
  }
}
```

Then run the sample myApp
```
node index.js
```

Place an inbound phone call...

# Development: container details

This covers details of each container directory you don't need to understand this to run the above, but it helps if you plan to modify any of it.
