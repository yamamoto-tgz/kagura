class Camera {
    constructor(api, position, target) {
        this.api = api;
        this.position = position;
        this.target = target;
        this.duration = 2.0;
        this.radius = position[Math.abs(1)];
    }

    moveTo(latitude, longitude) {
        console.log(`latitude: ${latitude}`);
        console.log(`longitude: ${longitude}`);

        this.api.recenterCamera();

        const lonRad = (longitude * Math.PI) / 180;
        const latRad = (latitude * Math.PI) / 180;

        const position = [
            (this.radius * Math.cos(latRad) * Math.sin(lonRad)).toFixed(2),
            (this.radius * Math.cos(latRad) * Math.cos(lonRad)).toFixed(2),
            (this.position[2] + this.radius * Math.sin(latRad)).toFixed(2),
        ];

        this.api.setCameraLookAt(position, this.target, this.duration);
    }
}

(() => {
    const client = new Sketchfab('1.12.1', document.querySelector('#sketchfab'));

    const uid = 'b79f0e54a7eb48afaa1b33db6d11f971';
    const position = [0.0, -1.0, 0.0];
    const target = [0.0, 0.0, 0.15];

    client.init(uid, {
        success: (api) => {
            api.addEventListener('camerastop', () => {
                api.getCameraLookAt((_, camera) => {
                    console.log(`position: ${camera.position.map((d) => d.toFixed(2))}`);
                    console.log(`target:   ${camera.target.map((d) => d.toFixed(2))}`);
                });
            });

            const camera = new Camera(api, position, target);

            document.querySelector('#moveButton').addEventListener('click', (e) => {
                const longitude = document.querySelector('#xInput').value;
                const latitude = document.querySelector('#yInput').value;
                camera.moveTo(latitude, longitude);
            });

            document.querySelector('#randomButton').addEventListener('click', (e) => {
                const max = 180;
                const min = -180;
                const latitude = Math.floor(Math.random() * (max - min + 1)) + min;
                const longitude = Math.floor(Math.random() * (max - min + 1)) + min;
                camera.moveTo(latitude, longitude);
            });
        },
        camera: 0,
        autostart: 1,
        dnt: 0,
    });
})();
