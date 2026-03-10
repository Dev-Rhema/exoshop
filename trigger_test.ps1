$PIXEL_ID = "1439469536842273"
$ACCESS_TOKEN = "EAALal73E8JkBQztramkCk5vBrUWz7iUNhepaZBTRnG1sRJLhYxgLoy7cSEcFNeNyKLsLnZBuWa8fil0XmnRLprPpIZBO2khxc7UaCUimXMZCjQKBrY0W1a7P7djw4PDdqq4RbuJwZBBrEkzx3lLDYXTNDDlhx5l1qKZAEQREpr0TDL1eDFWP194apIbQvY8AZDZD"
$TEST_CODE = "TEST14501"
$time = [long](Get-Date -UFormat %s)

$body = @{
    data = @(
        @{
            event_name = "Purchase"
            event_time = $time
            action_source = "website"
            event_id = "server_trigger_real_" + (Get-Date -Format 'HHmm')
            user_data = @{
                em = @("7b46d0342551ec468e815e12ec6861611794e7724eb87030836ce26589a1f349")
            }
            custom_data = @{
                value = 5000
                currency = "NGN"
            }
        }
    )
    test_event_code = $TEST_CODE
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Method Post -Uri "https://graph.facebook.com/v18.0/$PIXEL_ID/events?access_token=$ACCESS_TOKEN" -ContentType "application/json" -Body $body
