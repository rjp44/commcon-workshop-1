# Commcon Workshop

This is a collection of resources for the first CommCon Workshop

## How to run...

Find a convenient host, note it's external (public) IP. Ensure that inbound TCP traffic to HTTPS (443) and SIP-TLS (5061) is enabled.
```
export TRUNK_TYPE=Simwood
export TRUNK_ACCOUNT=XXXXXXXXXXXXX
export TRUNK_PASSWORD=YYYYYYYYYYYYY
```
Start the containers:
```
docker-compose up
```

Then run the sample myApp
```
cd myApp
node index.js
```

# Development: container details

This covers details of each container directory you don't need to understand this to run the above, but it helps if you plan to modify any of it.
