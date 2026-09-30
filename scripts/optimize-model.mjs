// Optimiza un .glb para mostrarlo en la web (visores de src/data/models.yaml).
// Uso: npm run optimize:model -- entrada.glb public/models/salida.glb [ratio] [error]
//   ratio: fracción de vértices a conservar (0.1 = 10 %). Sube el valor si
//          se ven huecos o piezas deformadas; 0.1-0.4 suele bastar.
//   error: tolerancia de la simplificación (relativa al tamaño del modelo).
import { NodeIO, PropertyType } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, simplify, dedup, prune, draco, getSceneVertexCount, VertexCountMethod } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import draco3d from 'draco3dgltf';

const [input, output, ratio = '0.2', error = '0.002'] = process.argv.slice(2);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco3d.createDecoderModule(),
  'draco3d.encoder': await draco3d.createEncoderModule(),
});
const doc = await io.read(input);
const count = () => getSceneVertexCount(doc.getRoot().listScenes()[0], VertexCountMethod.UPLOAD);
const before = count();

// Sin texturas, las UV no aportan nada y parten la malla en costuras. Las
// normales de aristas duras también la parten y bloquean la simplificación:
// sin normales, el visor usa sombreado plano (spec glTF), ideal para
// hard-surface.
const hasTextures = doc.getRoot().listTextures().length > 0;
if (!hasTextures) {
  for (const mesh of doc.getRoot().listMeshes())
    for (const prim of mesh.listPrimitives()) {
      prim.setAttribute('TEXCOORD_0', null);
      prim.setAttribute('NORMAL', null);
    }
}

await doc.transform(
  // Sin materiales: colorMap depende de sus nombres
  dedup({ propertyTypes: [PropertyType.ACCESSOR, PropertyType.MESH, PropertyType.TEXTURE] }),
  weld(),
  simplify({ simplifier: MeshoptSimplifier, ratio: Number(ratio), error: Number(error) }),
  prune(),
  draco(),
);
await io.write(output, doc);
console.log(`${input}: ${before} -> ${count()} vértices (texturas: ${hasTextures})`);
