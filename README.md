# Azure Functions Testing

## Start Durable Function Orchestration

https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-http-api#start-orchestration

```powershell
$durableFunctionResponse = $(Invoke-WebRequest -Method POST -Uri http://localhost:7071/runtime/webhooks/durabletask/orchestrators/fanOutFanInDemo)
$instanceId = $(ConvertFrom-Json $durableFunctionResponse.Content).id
$instanceId
```

## Status of Durable Function Instance

https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-http-api#get-instance-status

```powershell
$durableFunctionStatus = $(Invoke-WebRequest -Method GET -uri "http://localhost:7071/runtime/webhooks/durabletask/instances/$instanceId")
$durableFunctionStatusJson = $(ConvertFrom-Json $durableFunctionStatus.Content)
$durableFunctionStatusJson
```

```
    ?taskHub={taskHub}
    &connection={connectionName}
    &code={systemKey}
    &showHistory=[true|false]
    &showHistoryOutput=[true|false]
    &showInput=[true|false]
    &returnInternalServerErrorOnFailure=[true|false]
```
