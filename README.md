# ERROR - O

**A 3D space mission survival game built for the NASA Space Apps Challenge.**

An alpaca crew loses its course to the Moon. Choose an emergency landing site, rebuild the spacecraft with salvaged parts, and keep its systems running on the journey back to Earth.

## Play locally

Install Node.js 22 or later, then run:

```bash
git clone https://github.com/srllamadev/ERROR-0.git
cd ERROR-0
npm install
npm run dev
```

Open the local URL printed by Vite. In Windows PowerShell, use `npm.cmd install` and `npm.cmd run dev` if script execution is blocked.

Choose **Iniciar misión** for the full game or **Probar Nivel 2** to jump directly to the onboard emergency. The interface is in Spanish.

| Control | Action |
| --- | --- |
| **W, A, S, D** | Move |
| **E** | Interact with a nearby object or station |
| **Esc** | Close a panel |
| **Mouse or touch** | Connect terminals, place the hull patch, or trace the navigation route |

## The mission

### Level 1 — Emergency landing

Select a destination using Earth-to-planet distances from JPL Horizons. Recover parts before your oxygen runs out, then assemble the ship and check its mass, thrust, fuel, power, and navigation. Farther destinations require more modules. A failed launch test reports the missing component or defect so you can return to the workshop and correct it.

### Level 2 — Onboard emergency

An asteroid strikes during the return flight. Explore the ship and use the systems monitor to identify faults. Isolate the damaged electrical branch, reconnect four terminals, patch the hull breach, and trace a course back to Earth. Your prelaunch configuration affects backup power and maneuvering fuel. The mission fails if oxygen runs out or the correction window closes.

## NASA and JPL resources

| Resource | How it is used |
| --- | --- |
| [JPL Horizons](https://ssd-api.jpl.nasa.gov/doc/horizons.html) | Supplies geometric distances from Earth's center to Venus, Mars, Jupiter, Saturn, and Uranus. The navigation monitor requests the selected planet's distance through the local server. |
| [NASA CubeSat 101](https://science.nasa.gov/wp-content/uploads/2023/06/nasa_csli_cubesat_101_508.pdf) | Informs the workshop's subsystem integration and prelaunch review. |
| [NASA Power Management and Distribution](https://www.nasa.gov/smallsat-institute/sst-soa/power-subsystems/#3.6) | Informs the electrical repair task, including fault isolation and transfer to a backup branch. |
| [NASA GMAT](https://software.nasa.gov/software/GSC-19640-1) and [JPL SBDB](https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=101955) | Linked in the workshop as further reading on trajectory planning and small bodies. |

The engineering thresholds, fuel costs, hazards, and repair tasks are simplified gameplay mechanics. The Level 2 impact is fictional.

## Technical notes

The game uses React, Vite, Three.js, React Three Fiber, Drei, and Zustand.

- `src/components/ui/NavigationMonitor.jsx` requests and displays Horizons distances.
- `horizons-server.js` queries JPL, parses distances, and caches each result for 15 minutes.
- `vite.config.js` registers the endpoint for the development and preview servers.
- `src/scenes/` contains the environment and flight scenes. `src/utils/` contains the engineering and mission logic.

Run `npm run build` to generate `dist/`. Use `npm exec -- vite preview` to preview the build locally. Live distances require a server that provides `/api/horizons-distance`. If the endpoint or JPL is unavailable, the game displays the saved Horizons distances and their original epoch.
