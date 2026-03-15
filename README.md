# PromptStudio Local

Versión local de PromptStudio en `HTML + CSS + JavaScript`, con dos modos:

- `Local`: abre [index.html](/Users/josegago/Proyectos/PROMPTSTUDIO/index.html) directamente en Chrome y genera prompts con reglas internas.
- `IA`: usa un backend local mínimo para refinar el prompt con la API de OpenAI sin exponer tu clave en el navegador.

## Abrir sin servidor

1. Abre [index.html](/Users/josegago/Proyectos/PROMPTSTUDIO/index.html) con doble clic o con:

```bash
open -a "Google Chrome" /Users/josegago/Proyectos/PROMPTSTUDIO/index.html
```

2. Usa `Modo local` para trabajar sin backend.

## Activar modo IA

1. Instala dependencias:

```bash
npm install
```

2. Crea un `.env` a partir de [.env.example](/Users/josegago/Proyectos/PROMPTSTUDIO/.env.example) y añade tu `OPENAI_API_KEY`.

3. Arranca el backend local:

```bash
npm start
```

4. Mantén abierta la app en Chrome. El modo IA detectará el backend en `http://127.0.0.1:8787`.

También puedes abrir la app servida por el propio backend:

```bash
open -a "Google Chrome" http://127.0.0.1:8787
```

## Notas

- El modo IA usa la `Responses API` con el SDK oficial de OpenAI desde Node.js.
- El modo local sigue funcionando aunque el backend no esté arrancado.
- El archivo [PromptStudio.jsx](/Users/josegago/Proyectos/PROMPTSTUDIO/PromptStudio.jsx) se conserva como referencia del prototipo anterior.
