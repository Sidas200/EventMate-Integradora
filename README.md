# EventMate-Integradora
Este es un repositorio donde se encontrara todo lo relacionado con el proyecto de integradora.

Funcionamiento Actual del programa:
Actualmente se tiene un avanze grande en cuanto al funcionamiento actual del programa
las interfaces con las que se cuenta actualmente es la interfaz de venues principal,
la de venue individual, la del registro para los clientes, la de el inicio de sesion 
para los clientes, la de mobiliario, el home de la pagina web y la pagina de catering.
Tambien, se tiene todo lo relacionado con el servidor dentro de la carpeta de backend, dentro de la cual se encuentra nuestro index en el cual se crea todo lo necesario
para poder establecer la conexión con el servidor y ahi mimso se ecuentran todos los
endpoints utilizados para poder realizar modificaciones en la base de datos y poder
realizar diversos registros en la base de datos. Para el servidor se utiliza la tecnologia de node.js, el cual nos permite
crear las herramientas necesarias del lado del servidor y aplicaciones utilizando JavaScript, tambien con el uso de express el cual es un framework de node.js el cual facilita la gestion de rutas. Tambien se cuenta con diferentes dependencias las cuales son express, mysql2, body-parser, cors y páth, cada una de estas dependencias nos permiten hacer un uso diferentes de diversas 
herramientas como MySQL workbench, tambien nos permiten hacer la redireccion del sitio web, entre otras cosas.

El primer endpoint que tenemos en el codigo del servidor se utiliza para agregar un nuevo cliente a la base de datos, cuando se realiza la solicitud "POST" a esta ruta, el servidor recibe los datos del cliente que se ingresan en el registro en el cuerpo de la solicitud "req.body", los procesa y finalmente si todos los datos estan correctos los inserta en la tabla "clientes" de la base de datos, dentro del cuerpo de la solicitud se incluyen los diferentes campos los cuales son los mismos que se encuentran dentro de la base de datos. Si no hay ningun problema se manda un mensaje a consola de que el cliente se ha guardado correctamente, en caso contrario se indica que hubo un error al guardar el cliente.
En el codigo JavaScript del registro el cual utiliza todo lo anterior del servidor, dentro del codigo se obtiene una referencia del formulario HTML que tenemos y se guarda en una constante llamada form, de ahi se hada el evento 'submit' al formulario, utilizando el event.prevent default se previene el comportamiento predeterminado del formulario, se crea una instancia de formdata con los datos que se tienen en el formulario, utilizando el 'object.fromEntries(dataForm)' convierte todos los datos dentro del formulario en un objeto JSON, usando el fetch se ha el envio de la solicitud del post al endpoint de clientes, se configura para indicar que el contenido es JAON, los datos del form se convierten en cadena JSON y se envian al cuerpo de la solicitud, si la insercion de los datos es exitopsa entonces se redirecciona la pagina al inicio de sesion.

El segundo endpoint utilizando el metodo post en la ruta de la tabla de login_cliente, el servidor espera a que la solicitud contenga un cuerpo con los campos del correo y la contraela, los datos recibidos se extraen del cuerpo de la solicitud utilizando el 'req.body', se realiza una consulta a la base de datos, la consulta busca in registro de la tabla de clietnes que coincida con el correo y la contraseña que ingreso el cliente, los valosres de correo y contrsela se pasan como parametros a la consulta, si ocurre alguna error entonces se manda un mensaje a la consola indicando que hubo un error en el servidor, se la consulta se realiza con exito se verifca que los registros , si los datos ingresados coiniciden entonces se redirecciona la pagina al menu principal donde se encuentra toda la informacion de la pagina web, se obtiene una referencia del formulario HTML que tenemos y se guarda en una constante llamada form, de ahi se hada el evento 'submit' al formulario, utilizando el event.prevent default se previene el comportamiento predeterminado del formulario, se crea una instancia de formdata con los datos que se tienen en el formulario, utilizando el 'object.fromEntries(dataForm)' convierte todos los datos dentro del formulario en un objeto JSON, usando el fetch se ha el envio de la solicitud del post al endpoint de clientes, se configura para indicar que el contenido es JAON, los datos del form se convierten en cadena JSON y se envian al cuerpo de la solicitud, si los datos coinciden entonces se ha una redireccion al home de la pagina web


