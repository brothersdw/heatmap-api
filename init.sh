#!/bin/bash
RUNNING=false
sleep 5
while [ $RUNNING != true ]
do
    # result=curl -X POST http://localhost:3008/insert-test-diseases
    if curl -X POST http://localhost:3008/insert-test-diseases
    then
        echo 'Successfully inserted initial test diseases'
        if curl -X POST http://localhost:3008/create-county-case-counts
        then
            RUNNING=true
        else
            echo 'Unable to insert county case counts into table will try again!'
            sleep 5
        fi
    else
        echo 'Container has not completely started yet!'
        sleep 5
    fi
done
