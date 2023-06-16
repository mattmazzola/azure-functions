# Azure Functions

## Durable Functions

- Orchestrator function
    - describes a workflow that orchestrates other functions.
- Activity function
    - called by the orchestrator function, performs work, and optionally returns a value.
- Client function
    - a regular Azure Function that starts an orchestrator function. This example uses an HTTP triggered function.

```powershell
$durableFunctionBaseUrl = "http://localhost:7071/runtime/webhooks/durabletask"
```

## Start Durable Function Orchestration

https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-http-api#start-orchestration

```powershell
$durableFunctionResponse = $(Invoke-WebRequest -Method POST -Uri "$durableFunctionBaseUrl/orchestrators/fanOutFanInDemo")
$instanceId = $(ConvertFrom-Json $durableFunctionResponse.Content).id
echo $instanceId
```

## Status of Durable Function Instance

https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-http-api#get-instance-status

```powershell
$durableFunctionStatus = $(Invoke-WebRequest -Method GET -uri "$durableFunctionBaseUrl/instances/$instanceId")
$durableFunctionStatusJson = $(ConvertFrom-Json $durableFunctionStatus.Content)
echo $durableFunctionStatusJson
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
