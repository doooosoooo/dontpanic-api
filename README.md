# API

## User

{% swagger method="get" path="/loginUser" baseUrl="https://us-central1-dontpanic-zerone.cloudfunctions.net" summary="Login user by user data" %}
{% swagger-description %}

{% endswagger-description %}

{% swagger-parameter in="body" name="nickname" required="true" %}
User Name
{% endswagger-parameter %}

{% swagger-parameter in="body" name="slime_color" required="true" %}
Selected by User
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="" %}

```javascript
{
    nickname: [string],
    slime_color: [string].
    level: [number]
}
```

{% endswagger-response %}
{% endswagger %}
