# Documentación: Sistema de Agendamiento de Citas Médicas - Reto Indra

<p style="text-align:center;">Un asegurado desea agendar una cita médica, ingresa a la aplicación y escoge el centro médico,
la especialidad, el médico y la fecha y hora de un listado que muestra la aplicación web. Luego
presiona un botón “Agendar” y los datos son enviados a una aplicación backend que le devuelve
un mensaje diciéndole que el agendamiento está en proceso.
Esta aplicación funciona tanto para Perú como Chile. El procesamiento de agendamiento es
distinto por país</p>

[![Diagrama.png](https://i.ibb.co/s9ZFb0qR/Diagrama.png)](https://ibb.co/chjNkGQ3)


## Descripción del Proyecto

Sistema backend para agendamiento de citas médicas multi-país (Perú y Chile), que permite a asegurados programar citas médicas.

**Componentes**

- **AWS Lambda:** Procesamiento serverless
- **API Gateway:** Exposición de APIs RESTful
- **DynamoDB:** Almacenamiento de citas médicas
- **SNS:** Notificaciones de nuevas citas
- **SQS:** Colas de procesamiento por país
- **RDS MySQL:** Bases de datos relacionales por país
- **EventBridge:** Orquestación de eventos de confirmación

**Características**

- Agendamiento multi-país (Perú y Chile)
- Procesamiento asíncrono por país
- Notificaciones automáticas
- Confirmación de citas via eventos
- Escalabilidad automática
- Arquitectura serverless


## Arquitectura del Sistema

El sistema está diseñado utilizando una arquitectura orientada a eventos combinada con arquitectura hexagonal, donde cada cita médica pasa por un flujo de procesamiento automatizado y desacoplado

**Flujo Completo de una Cita**

1. **Se recibe la solicitud en API Gateway :**  El fronted envía la solicitud de agendamiento a través de API Gateway.

2. **Guarda citas en DynamoDB (Appointments) :**  La información inicial de la cita se guarda en DynamoDB con estado "PENDING".

3. **Notifica via SNS cuando se crea una cita :**  Se publica un evento en SNS para notificar la creación de la cita.

4. **Procesa diferido por país via SQS (Perú o Chile) :**  El mensaje se encola en SQS según el país (Perú o Chile) para procesamiento asíncrono.

5. **Accede a bases de datos relacionales (RDS MySQL) :**  Lambdas específicas por país acceden a sus respectivas bases de datos MySQL para su almacenamiento.

6. **Publica eventos para confirmaciones (EventBridge) :**  Se publican eventos en EventBridge para notificar el completamiento del procesamiento.

7. **Actualiza estado de cita en DynamoDB :**  El estado de la cita se actualiza a "COMPLETED".

## Endpoints


| Endpoints | Métodos | Url |
|----------|----------|----------|
| Crear Cita    | Post  | https://j4k3hovnqk.execute-api.us-east-1.amazonaws.com/dev/appointments  |
| Consultar Cita    | Get  | https://j4k3hovnqk.execute-api.us-east-1.amazonaws.com/dev/appointments/{insuredId}|

---
### 1. Crear cita 

**Body Request :**
```json
{
  "insuredId": "00001",
  "scheduleId": 1,
  "countryISO": "PE"
}
```
**Respuesta :**


```json
{
  "success": true,
  "data": {
    "id": "71054e01-6e76-480a-9acc-bd1fc0785857",
    "insuredId": "00005",
    "scheduleId": 7,
    "countryISO": "PE",
    "status": "PENDING",
    "createdAt": "2025-09-15T05:34:19.558Z",
    "updatedAt": "2025-09-15T05:34:19.558Z"
  }
}
```

### 2. Consultar cita 

**Respuesta :**


```json
{
  "success": true,
  "data": [
    {
      "insuredId": "00005",
      "scheduleId": 7,
      "updatedAt": "2025-09-15T05:34:20.718Z",
      "status": "COMPLETED",
      "createdAt": "2025-09-15T05:34:19.558Z",
      "id": "71054e01-6e76-480a-9acc-bd1fc0785857",
      "countryISO": "PE"
    }
  ]
}
```

## Pruebas Unitarias

[![Test.png](https://i.ibb.co/WpPrYGvQ/Tets.png)](https://ibb.co/cXCW7khP)

## Documentación Swagger
[Documentación](https://9h788vawhi.execute-api.us-east-1.amazonaws.com/swagger)