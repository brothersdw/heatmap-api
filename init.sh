#!/bin/bash
RUNNING=false
sleep 5
while [ $RUNNING != true ]
do
    # result=curl -X POST http://localhost:3008/insert-test-diseases
    if curl -X POST http://localhost:3008/insert-test-diseases
    then
        echo 'Successfully inserted initial test diseases'
        RUNNING=true
    else
        curl -X POST http://localhost:3008/insert-test-diseases
        echo 'Container has not completely started yet!'
        sleep 5
    fi
done
