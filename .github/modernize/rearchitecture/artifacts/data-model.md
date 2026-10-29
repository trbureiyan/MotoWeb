# Data model

Colecciones Mongoose existentes:

- `users`: identidad, credenciales bcrypt, rol y estado activo.
- `brands`: nombre, slug, logo y estado activo.
- `services`: nombre, descripción, horas y rango de precio.
- `appointments`: referencias a usuario, marca y servicio; modelo de moto como texto; fecha, estado y notas administrativas.
- `reviews`, `notifications`, `payments`, `page_views`, `workshop_stats` y `gallery_images`: entidades de soporte ya modeladas, todavía sin API completa.

Relaciones principales: `appointments.user → users`, `appointments.brand → brands`, `appointments.service → services`; `payments` y `reviews` referencian `appointments`; `workshop_stats` referencia marca y servicio destacados.

El modelo de motocicleta no tiene una colección propia: `Appointment.motorcycleModel` es un `String` obligatorio. El seed carga marcas y servicios; el usuario escribe el modelo libremente al reservar.
