Esta es una aplicación construída en Next Js. Su finalidad es gestionar una base de datos de imágenes históricas,
con sus respectivas descripciones y datos. Sus dos partes principales son el navegador (página Archivo)
y el editor (página Admin).

A partir de que empezamos a navegar en Archivo, se activa la página Categories.

Dentro del editor, al que se accede iniciando sesión como colaborador, tenemos un menú con varias opciones.
En principio, la opción Nueva Publicación, que abre el componente CREATE COMPONENT.

Si lo que queremos es editar una publicación existente, haciendo click en Editar Publicación, accedemos
a EDIT COMPONENT.

Tanto CREATE como EDIT, reutilizan los componentes PUBLICATIONDATASETTER, DESCRIPTIONSETTER, e IMAGEUPLOADER.