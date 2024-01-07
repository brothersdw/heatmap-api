#!/bin/bash

RUNNING=false

while [ $RUNNING != true ]
do
    if curl -X POST http://localhost:3008/insert-test-diseases
    then
        echo 'Successfully inserted initial test diseases'
        RUNNING=true
    else
        npm run dev
        echo 'Container has not completely started yet!'
        sleep 5
    fi
done