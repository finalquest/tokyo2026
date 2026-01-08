# Estado actual de mapas por bloque

## Bloques ya convertidos
- **1-asakusa**  
  - `data/places-input/1-asakusa.json` consolidado con todos los puntos del MD.  
  - `npm run fetch:block -- 1-asakusa`, `npm run routes:block -- 1-asakusa` y `npm run build:map -- 1-asakusa` ya corridos → existen `data/places/1-asakusa.json`, `data/routes/1-asakusa.json` y `maps/1-asakusa.kml`.
- **2-nippori**  
  - `data/places-input/2-nippori.json` creado manualmente revisando el bloque.  
  - Se ejecutaron fetch/routes/build y quedó `maps/2-nippori.kml`.
- **3-monzen-nakacho** (último paso realizado)  
  - `data/places-input/3-monzen-nakacho.json` incluye estación, Tomioka Hachimangu, Fukagawa Fudo-do, shotengai, Eitai-dori, Kiyosumi Garden/Shirakawa y Mukojima.  
  - Corridos `npm run fetch:block -- 3-monzen-nakacho`, `npm run routes:block -- 3-monzen-nakacho`, `npm run build:map -- 3-monzen-nakacho` → existen `data/places/3-monzen-nakacho.json`, `data/routes/3-monzen-nakacho.json` y `maps/3-monzen-nakacho.kml`.
- **4-kagurazaka**  
  - `data/places-input/4-kagurazaka.json` detalla acceso por Iidabashi, las callecitas Hyogo/Kagurazaka, Akagi-jinja, Ichigaya/Sotobori y el tramo final Yasukuni → Kokyo → Koishikawa.  
  - Corridos `npm run fetch:block -- 4-kagurazaka`, `npm run routes:block -- 4-kagurazaka`, `npm run build:map -- 4-kagurazaka` → existen `data/places/4-kagurazaka.json`, `data/routes/4-kagurazaka.json` y `maps/4-kagurazaka.kml`.
- **5-sugamo-komagome-rikugien**  
  - `data/places-input/5-sugamo-komagome-rikugien.json` cubre todo el eje Sugamo → Komagome → Ikebukuro café → Rikugien/Kyū-Furukawa + cierre Spa LaQua.  
  - Corridos `npm run fetch:block -- 5-sugamo-komagome-rikugien`, `npm run routes:block -- 5-sugamo-komagome-rikugien`, `npm run build:map -- 5-sugamo-komagome-rikugien` → existen `data/places/5-sugamo-komagome-rikugien.json`, `data/routes/5-sugamo-komagome-rikugien.json` y `maps/5-sugamo-komagome-rikugien.kml`.
- **6-oji-asukayama-tabata**  
  - `data/places-input/6-oji-asukayama-tabata.json` lista estaciones, Ōji Inari + Ōji-jinja, shotengai, monorraíl/parques/museos y la bajada a Tabata con cafés y santuarios literarios.  
  - Corridos `npm run fetch:block -- 6-oji-asukayama-tabata`, `npm run routes:block -- 6-oji-asukayama-tabata`, `npm run build:map -- 6-oji-asukayama-tabata` → existen `data/places/6-oji-asukayama-tabata.json`, `data/routes/6-oji-asukayama-tabata.json` y `maps/6-oji-asukayama-tabata.kml`.
- **7-tokyo-station-nihonbashi-marunouchi**  
  - `data/places-input/7-tokyo-station-nihonbashi-marunouchi.json` repasa plaza Marunouchi, arte en Naka-dori, miradores KITTE, museos Tokyo Station/Mitsubishi y todo el eje Nihonbashi → bolsa/Tokyo Torch → Otemon.  
  - Corridos `npm run fetch:block -- 7-tokyo-station-nihonbashi-marunouchi`, `npm run routes:block -- 7-tokyo-station-nihonbashi-marunouchi`, `npm run build:map -- 7-tokyo-station-nihonbashi-marunouchi` → existen `data/places/7-tokyo-station-nihonbashi-marunouchi.json`, `data/routes/7-tokyo-station-nihonbashi-marunouchi.json` y `maps/7-tokyo-station-nihonbashi-marunouchi.kml`.
- **8-chiyoda-jimbocho-chidorigafuchi**  
  - `data/places-input/8-chiyoda-jimbocho-chidorigafuchi.json` cubre el lazo Otemachi → Kokyogaien/Nijubashi → Chidorigafuchi → bajada a Kudanshita/Jimbochō y el cierre en Printing Museum + Tokyo Dome/Suidōbashi.  
  - Corridos `npm run fetch:block -- 8-chiyoda-jimbocho-chidorigafuchi`, `npm run routes:block -- 8-chiyoda-jimbocho-chidorigafuchi`, `npm run build:map -- 8-chiyoda-jimbocho-chidorigafuchi` → existen `data/places/8-chiyoda-jimbocho-chidorigafuchi.json`, `data/routes/8-chiyoda-jimbocho-chidorigafuchi.json` y `maps/8-chiyoda-jimbocho-chidorigafuchi.kml`.
- **9-ueno-okachimachi-ameyoko**  
  - `data/places-input/9-ueno-okachimachi-ameyoko.json` repasa Ueno Park (templos + museos), Shinobazu, Ameyoko, 2k540 y el cierre café en Kuramae.  
  - Corridos `npm run fetch:block -- 9-ueno-okachimachi-ameyoko`, `npm run routes:block -- 9-ueno-okachimachi-ameyoko`, `npm run build:map -- 9-ueno-okachimachi-ameyoko` → existen `data/places/9-ueno-okachimachi-ameyoko.json`, `data/routes/9-ueno-okachimachi-ameyoko.json` y `maps/9-ueno-okachimachi-ameyoko.kml`.
- **10-itabashi-oyama**  
  - `data/places-input/10-itabashi-oyama.json` cubre estación base, rastros de Nakasendō, Jōren-ji, Happy Road Oyama y desvíos locales (museo, senbei).  
  - Corridos `npm run fetch:block -- 10-itabashi-oyama`, `npm run routes:block -- 10-itabashi-oyama`, `npm run build:map -- 10-itabashi-oyama` → existen `data/places/10-itabashi-oyama.json`, `data/routes/10-itabashi-oyama.json` y `maps/10-itabashi-oyama.kml`.
- **11-kichijoji-inokashira**  
  - `data/places-input/11-kichijoji-inokashira.json` con shotengai (Sun Road, Harmonica), cafés, parque, santuario, zoo y desvíos dulces/templos.  
  - Corridos `npm run fetch:block -- 11-kichijoji-inokashira`, `npm run routes:block -- 11-kichijoji-inokashira`, `npm run build:map -- 11-kichijoji-inokashira` → existen `data/places/11-kichijoji-inokashira.json`, `data/routes/11-kichijoji-inokashira.json` y `maps/11-kichijoji-inokashira.kml`.
- **12-shimokitazawa-sangenjaya**  
  - `data/places-input/12-shimokitazawa-sangenjaya.json` recorre tiendas vintage, cafés, Bonus Track, reload, santuario de barrio y salto a Sangenjaya (Carrot Tower + Sankaku Chitai).  
  - Corridos `npm run fetch:block -- 12-shimokitazawa-sangenjaya`, `npm run routes:block -- 12-shimokitazawa-sangenjaya`, `npm run build:map -- 12-shimokitazawa-sangenjaya` → existen `data/places/12-shimokitazawa-sangenjaya.json`, `data/routes/12-shimokitazawa-sangenjaya.json` y `maps/12-shimokitazawa-sangenjaya.kml`.
- **13-daikanyama-nakameguro-meguro-river**  
  - `data/places-input/13-daikanyama-nakameguro-meguro-river.json` combina Daikanyama T-Site/Hillside, cafés, Saigōyama Park, el paseo por el río Meguro y cierre cultural/gastronómico (Sky Garden, Meguro Fudō, Ebisu Yokocho).  
  - Corridos `npm run fetch:block -- 13-daikanyama-nakameguro-meguro-river`, `npm run routes:block -- 13-daikanyama-nakameguro-meguro-river`, `npm run build:map -- 13-daikanyama-nakameguro-meguro-river` → existen `data/places/13-daikanyama-nakameguro-meguro-river.json`, `data/routes/13-daikanyama-nakameguro-meguro-river.json` y `maps/13-daikanyama-nakameguro-meguro-river.kml`.
- **14-koenji-nakano**  
  - `data/places-input/14-koenji-nakano.json` cubre shotengai Pal/Look, discos, santuarios, parques, live houses y la segunda mitad en Nakano Broadway + Mandarake.  
  - Corridos `npm run fetch:block -- 14-koenji-nakano`, `npm run routes:block -- 14-koenji-nakano`, `npm run build:map -- 14-koenji-nakano` → existen `data/places/14-koenji-nakano.json`, `data/routes/14-koenji-nakano.json` y `maps/14-koenji-nakano.kml`.
- **15-akihabara-kanda**  
  - `data/places-input/15-akihabara-kanda.json` pasa por Radio Center, arcades, Mandarake/Akiba Cultures, cafés temáticos, Kanda Myōjin y cierre gastronómico en Kanda.  
  - Corridos `npm run fetch:block -- 15-akihabara-kanda`, `npm run routes:block -- 15-akihabara-kanda`, `npm run build:map -- 15-akihabara-kanda` → existen `data/places/15-akihabara-kanda.json`, `data/routes/15-akihabara-kanda.json` y `maps/15-akihabara-kanda.kml`.
- **16-ikebukuro-sugamo**  
  - `data/places-input/16-ikebukuro-sugamo.json` usa Ikebukuro como base, recorre la mitad norte de Jizō-dōri, cafés retro, desvío a Ōtsuka/Toden y regresa por Otome Road.  
  - Corridos `npm run fetch:block -- 16-ikebukuro-sugamo`, `npm run routes:block -- 16-ikebukuro-sugamo`, `npm run build:map -- 16-ikebukuro-sugamo` → existen `data/places/16-ikebukuro-sugamo.json`, `data/routes/16-ikebukuro-sugamo.json` y `maps/16-ikebukuro-sugamo.kml`.
- **17-kamakura-enoshima**  
  - `data/places-input/17-kamakura-enoshima.json` arma la excursión completa (Kamakura centro, Hase/Daibutsu, Enoshima con faro y cuevas).  
  - Corridos `npm run fetch:block -- 17-kamakura-enoshima`, `npm run routes:block -- 17-kamakura-enoshima`, `npm run build:map -- 17-kamakura-enoshima` → existen `data/places/17-kamakura-enoshima.json`, `data/routes/17-kamakura-enoshima.json` y `maps/17-kamakura-enoshima.kml`.
- **18-nikko-utsunomiya**  
  - `data/places-input/18-nikko-utsunomiya.json` cubre Toshōgū completo, opcional Chuzenji/Kegon y la escala de gyozas en Utsunomiya.  
  - Corridos `npm run fetch:block -- 18-nikko-utsunomiya`, `npm run routes:block -- 18-nikko-utsunomiya`, `npm run build:map -- 18-nikko-utsunomiya` → existen `data/places/18-nikko-utsunomiya.json`, `data/routes/18-nikko-utsunomiya.json` y `maps/18-nikko-utsunomiya.kml`.
- **19-hakone**  
  - `data/places-input/19-hakone.json` sigue el circuito Hakone Freepass (Yumoto → Gōra → Owakudani → lago Ashi → shrine → onsen/shotengai).  
  - Corridos `npm run fetch:block -- 19-hakone`, `npm run routes:block -- 19-hakone`, `npm run build:map -- 19-hakone` → existen `data/places/19-hakone.json`, `data/routes/19-hakone.json` y `maps/19-hakone.kml`.
- **20-yokosuka**  
  - `data/places-input/20-yokosuka.json` recorre estación central, Verny/Mikasa, Dobuita, templos y salto a Kannonzaki + Sarushima antes del curry final.  
  - Corridos `npm run fetch:block -- 20-yokosuka`, `npm run routes:block -- 20-yokosuka`, `npm run build:map -- 20-yokosuka` → existen `data/places/20-yokosuka.json`, `data/routes/20-yokosuka.json` y `maps/20-yokosuka.kml`.
- **21-kawagoe**  
  - `data/places-input/21-kawagoe.json` cubre estación, loop bus, Kurazukuri, dulces, Kitain, Hikawa y la vuelta por Shingashi + Kurari.  
  - Corridos `npm run fetch:block -- 21-kawagoe`, `npm run routes:block -- 21-kawagoe`, `npm run build:map -- 21-kawagoe` → existen `data/places/21-kawagoe.json`, `data/routes/21-kawagoe.json` y `maps/21-kawagoe.kml`.
- **23-sawara**  
  - `data/places-input/23-sawara.json` incluye estación, canal histórico, casa Inoh Tadataka, sake Tokun y el desvío a Katori Jingū.  
  - Corridos `npm run fetch:block -- 23-sawara`, `npm run routes:block -- 23-sawara`, `npm run build:map -- 23-sawara` → existen `data/places/23-sawara.json`, `data/routes/23-sawara.json` y `maps/23-sawara.kml`.
- **24-fujinomiya**  
  - `data/places-input/24-fujinomiya.json` cubre estación, Sengen Taisha, centro patrimonial, sake, cascadas Shiraito/Otodome y regreso gastronómico.  
  - Corridos `npm run fetch:block -- 24-fujinomiya`, `npm run routes:block -- 24-fujinomiya`, `npm run build:map -- 24-fujinomiya` → existen `data/places/24-fujinomiya.json`, `data/routes/24-fujinomiya.json` y `maps/24-fujinomiya.kml`.
- **37-chichibu**  
  - `data/places-input/37-chichibu.json` recorre estación, Chichibu Shrine, varios templos Kannon cercanos, Hitsujiyama Park y el onsen/compras finales.  
  - Corridos `npm run fetch:block -- 37-chichibu`, `npm run routes:block -- 37-chichibu`, `npm run build:map -- 37-chichibu` → existen `data/places/37-chichibu.json`, `data/routes/37-chichibu.json` y `maps/37-chichibu.kml`.
- **25-kanda-jimbocho-tokyo-station**  
  - `data/places-input/25-kanda-jimbocho-tokyo-station.json` une Kanda Station/Myōjin, librerías Jimbochō, cafés/curries, Glitch/Awajichō y cierre en Maach Ecute + Gransta.  
  - Corridos `npm run fetch:block -- 25-kanda-jimbocho-tokyo-station`, `npm run routes:block -- 25-kanda-jimbocho-tokyo-station`, `npm run build:map -- 25-kanda-jimbocho-tokyo-station` → existen `data/places/25-kanda-jimbocho-tokyo-station.json`, `data/routes/25-kanda-jimbocho-tokyo-station.json` y `maps/25-kanda-jimbocho-tokyo-station.kml`.
- **26-todoroki-jiyugaoka-gotokuji-shoin**  
  - `data/places-input/26-todoroki-jiyugaoka-gotokuji-shoin.json` enlaza Todoroki Valley/Fudōson, cafés de Jiyūgaoka y el tramo Setagaya Line hacia Gotokuji + Shōin-jinja.  
  - Corridos `npm run fetch:block -- 26-todoroki-jiyugaoka-gotokuji-shoin`, `npm run routes:block -- 26-todoroki-jiyugaoka-gotokuji-shoin`, `npm run build:map -- 26-todoroki-jiyugaoka-gotokuji-shoin` → existen `data/places/26-todoroki-jiyugaoka-gotokuji-shoin.json`, `data/routes/26-todoroki-jiyugaoka-gotokuji-shoin.json` y `maps/26-todoroki-jiyugaoka-gotokuji-shoin.kml`.
- **27-chofu-jindaiji-jindai-botanical**  
  - `data/places-input/27-chofu-jindaiji-jindai-botanical.json` cubre Chōfu Station → Tenjinyama → Jindaiji (templos + soba) → Jindai Botanical Garden → onsen/shotengai de regreso.  
  - Corridos `npm run fetch:block -- 27-chofu-jindaiji-jindai-botanical`, `npm run routes:block -- 27-chofu-jindaiji-jindai-botanical`, `npm run build:map -- 27-chofu-jindaiji-jindai-botanical` → existen `data/places/27-chofu-jindaiji-jindai-botanical.json`, `data/routes/27-chofu-jindaiji-jindai-botanical.json` y `maps/27-chofu-jindaiji-jindai-botanical.kml`.
- **28-mitaka-inokashira-norte**  
  - `data/places-input/28-mitaka-inokashira-norte.json` recorre Mitaka Station → shotengai/Nakamichi, Tamagawa Josui, exterior del Ghibli Museum y cafés residenciales hacia la galería local.  
  - Corridos `npm run fetch:block -- 28-mitaka-inokashira-norte`, `npm run routes:block -- 28-mitaka-inokashira-norte`, `npm run build:map -- 28-mitaka-inokashira-norte` → existen `data/places/28-mitaka-inokashira-norte.json`, `data/routes/28-mitaka-inokashira-norte.json` y `maps/28-mitaka-inokashira-norte.kml`.
- **29-kugayama-zenpukuji-river**  
  - `data/places-input/29-kugayama-zenpukuji-river.json` cubre shotengai Kugayama, paseo por Zenpukuji River/Park y cierre en Nishi-Ogikubo cafés.  
  - Corridos `npm run fetch:block -- 29-kugayama-zenpukuji-river`, `npm run routes:block -- 29-kugayama-zenpukuji-river`, `npm run build:map -- 29-kugayama-zenpukuji-river` → existen `data/places/29-kugayama-zenpukuji-river.json`, `data/routes/29-kugayama-zenpukuji-river.json` y `maps/29-kugayama-zenpukuji-river.kml`.
- **30-takanawa-sengakuji-gotanda**  
  - `data/places-input/30-takanawa-sengakuji-gotanda.json` sigue Takanawa Exit → Sengakuji → colinas residenciales → Gotanda shotengai + tramo sur del Meguro River.  
  - Corridos `npm run fetch:block -- 30-takanawa-sengakuji-gotanda`, `npm run routes:block -- 30-takanawa-sengakuji-gotanda`, `npm run build:map -- 30-takanawa-sengakuji-gotanda` → existen `data/places/30-takanawa-sengakuji-gotanda.json`, `data/routes/30-takanawa-sengakuji-gotanda.json` y `maps/30-takanawa-sengakuji-gotanda.kml`.
- **31-yanaka-profundo-ueno-toshogu-ikenohata**  
  - `data/places-input/31-yanaka-profundo-ueno-toshogu-ikenohata.json` se enfoca en callejones de Yanaka, templos discretos, Ueno Toshogu y el cierre en cafés de Ikenohata/Okachimachi.  
  - Corridos `npm run fetch:block -- 31-yanaka-profundo-ueno-toshogu-ikenohata`, `npm run routes:block -- 31-yanaka-profundo-ueno-toshogu-ikenohata`, `npm run build:map -- 31-yanaka-profundo-ueno-toshogu-ikenohata` → existen `data/places/31-yanaka-profundo-ueno-toshogu-ikenohata.json`, `data/routes/31-yanaka-profundo-ueno-toshogu-ikenohata.json` y `maps/31-yanaka-profundo-ueno-toshogu-ikenohata.kml`.
- **32-tokyo-tower-zojoji-shimbashi-atago-shiodome**  
  - `data/places-input/32-tokyo-tower-zojoji-shimbashi-atago-shiodome.json` une Zōjō-ji/Tokugawa, Tokyo Tower, Atago-jinja, Shimbashi y Shiodome + NHK Museum con cierre en Hamarikyu.  
  - Corridos `npm run fetch:block -- 32-tokyo-tower-zojoji-shimbashi-atago-shiodome`, `npm run routes:block -- 32-tokyo-tower-zojoji-shimbashi-atago-shiodome`, `npm run build:map -- 32-tokyo-tower-zojoji-shimbashi-atago-shiodome` → existen `data/places/32-tokyo-tower-zojoji-shimbashi-atago-shiodome.json`, `data/routes/32-tokyo-tower-zojoji-shimbashi-atago-shiodome.json` y `maps/32-tokyo-tower-zojoji-shimbashi-atago-shiodome.kml`.
- **33-shibamata-taishakuten-tora-san-rio-edo**  
  - `data/places-input/33-shibamata-taishakuten-tora-san-rio-edo.json` cubre estación, estatua de Tora-san, Taishakuten + Suikei-en, Yamamoto-tei y el paseo al río Edo/Museo Yamada Yōji.  
  - Corridos `npm run fetch:block -- 33-shibamata-taishakuten-tora-san-rio-edo`, `npm run routes:block -- 33-shibamata-taishakuten-tora-san-rio-edo`, `npm run build:map -- 33-shibamata-taishakuten-tora-san-rio-edo` → existen `data/places/33-shibamata-taishakuten-tora-san-rio-edo.json`, `data/routes/33-shibamata-taishakuten-tora-san-rio-edo.json` y `maps/33-shibamata-taishakuten-tora-san-rio-edo.kml`.
- **34-ginza-nihonbashi**  
  - `data/places-input/34-ginza-nihonbashi.json` hilvana Tokyo Station/Marunouchi Brick City, desvío Nihonbashi (puente + Coredo/Mitsukoshi), paseo por Chūō-dōri con hitos Wako/Ginza Place/Shiseido/Itoya, cafés clásicos (L’Ambre, Ginza West, Toraya) y cierre cultural Kabukiza/Tsukiji + rooftops Tokyu Plaza, Ginza Six y GranRoof.  
  - Corridos `npm run fetch:block -- 34-ginza-nihonbashi`, `npm run routes:block -- 34-ginza-nihonbashi`, `npm run build:map -- 34-ginza-nihonbashi` → existen `data/places/34-ginza-nihonbashi.json`, `data/routes/34-ginza-nihonbashi.json` y `maps/34-ginza-nihonbashi.kml`.
- **35-yasukuni-kokyo-gaien-museos-imperiales**  
  - `data/places-input/35-yasukuni-kokyo-gaien-museos-imperiales.json` recorre Kudanshita → Yasukuni (torii, honden, Yūshūkan), salida por Kitanomaru con Budokan/Museo de Ciencias/MOMAT + Archivo Nacional, y luego los fosos imperiales (Kōkyo Gaien, Nijūbashi, Shozokan) antes del desvío opcional a Koishikawa Kōrakuen y el regreso a Tokyo Station/Gransta.  
  - Corridos `npm run fetch:block -- 35-yasukuni-kokyo-gaien-museos-imperiales`, `npm run routes:block -- 35-yasukuni-kokyo-gaien-museos-imperiales`, `npm run build:map -- 35-yasukuni-kokyo-gaien-museos-imperiales` → existen `data/places/35-yasukuni-kokyo-gaien-museos-imperiales.json`, `data/routes/35-yasukuni-kokyo-gaien-museos-imperiales.json` y `maps/35-yasukuni-kokyo-gaien-museos-imperiales.kml`.
- **36-akabane-higashi-jujo**  
  - `data/places-input/36-akabane-higashi-jujo.json` sigue Akabane Station → Akabane Hachiman y el trío de templos barriales (Sōsen-ji/Jōshōji, Nanzō-in, Seikō-ji) hasta el Arakawa y las compuertas Iwabuchi, suma los santuarios Suwa + Katori y cierra en el shotengai de Higashi-Jūjō + estación para volver al hotel.  
  - Corridos `npm run fetch:block -- 36-akabane-higashi-jujo`, `npm run routes:block -- 36-akabane-higashi-jujo`, `npm run build:map -- 36-akabane-higashi-jujo` → existen `data/places/36-akabane-higashi-jujo.json`, `data/routes/36-akabane-higashi-jujo.json` y `maps/36-akabane-higashi-jujo.kml`.

## Cómo generar los próximos bloques
1. **Leer el Markdown del bloque** en `bloques/**/NN-nombre.md` y listar manualmente todos los lugares mencionados (templos, shotengai, cafés, extensiones opcionales).  
2. **Crear `data/places-input/NN-nombre.json`** con objetos `{ "name": "...", "hint": "..." }` siguiendo el mismo orden que en el MD. No hay extracción automática: lo revisamos a mano para asegurarnos de que no falte nada.  
3. **Resolver coordenadas y detalles**:  
   ```bash
   npm run fetch:block -- NN-nombre    # usa Google Places API
   npm run routes:block -- NN-nombre   # Directions API para pares consecutivos
   npm run build:map -- NN-nombre      # genera maps/NN-nombre.kml
   ```  
   Todos los comandos necesitan la variable `GOOGLE_MAPS_API_KEY` cargada (ya definida en `.env`).  
4. **Validar visualmente** importando `maps/NN-nombre.kml` en Google My Maps. Si falta algo, editar el `places-input` correspondiente y repetir los tres scripts para ese bloque.

Repetir este ciclo bloque por bloque. Cuando terminemos con la lista completa podemos, si hace falta, regenerar todo usando los mismos scripts en lotes, pero la idea es continuar “uno por vez” como venimos haciendo.
