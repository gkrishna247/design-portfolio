
import { describe, it, expect } from 'vitest';
import * as THREE from 'three';

describe('Orb Update Performance', () => {
    it('Should measure matrix update performance vs individual object update', () => {
        const count = 50;
        const dummy = new THREE.Object3D();
        const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial(), count);

        // Mock data
        const orbs = Array.from({ length: count }).map((_, i) => ({
            initialPosition: [Math.random() * 10, Math.random() * 10, Math.random() * 10],
            phase: Math.random() * Math.PI * 2
        }));

        const iterations = 10000;
        const start = performance.now();

        for (let j = 0; j < iterations; j++) {
            const time = j * 0.016;
            orbs.forEach((orb, i) => {
                dummy.position.set(
                    orb.initialPosition[0],
                    orb.initialPosition[1] + Math.sin(time + orb.phase) * 0.5,
                    orb.initialPosition[2]
                );
                dummy.rotation.x += 0.01;
                dummy.rotation.y += 0.01;
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            });
            mesh.instanceMatrix.needsUpdate = true;
        }

        const end = performance.now();
        console.log(`Matrix update for ${count} orbs x ${iterations} iterations: ${(end - start).toFixed(2)}ms`);

        expect(end - start).toBeLessThan(5000); // Sanity check
    });
});
