import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.resolve("data/devices.json");
const TEMP_FILE = path.resolve("data/devices.tmp.json");

const OFFLINE_TIMEOUT = 90000; // 10 seconds

function withOnlineStatus(device) {

    return {
        ...device,
        online:
            Date.now() -
            new Date(device.lastSeen).getTime() <
            OFFLINE_TIMEOUT
    };
}
let writeQueue = Promise.resolve();

/**
 * Read all devices from the JSON file.
 */
async function readDevices() {

    try {

        const data = await fs.readFile(
            DATA_FILE,
            "utf-8"
        );

        /*
         * Empty file.
         */
        if (data.trim() === "") {

            return [];

        }

        return JSON.parse(data);

    }
    catch (err) {

        /*
         * File doesn't exist.
         */
        if (err.code === "ENOENT") {

            await writeDevices([]);

            return [];

        }

        /*
         * Corrupted JSON.
         */
        if (err instanceof SyntaxError) {

            console.error(
                "[Device Store] Corrupted JSON detected. Resetting file..."
            );

            await writeDevices([]);

            return [];

        }

        throw err;

    }

}

/**
 * Write all devices back to the JSON file atomically.
 */
async function writeDevices(devices) {

    const json = JSON.stringify(
        devices,
        null,
        4
    );

    await fs.writeFile(
        TEMP_FILE,
        json,
        "utf-8"
    );

    await fs.rename(
        TEMP_FILE,
        DATA_FILE
    );

}

/**
 * Add or update a device.
 */
export async function updateDevice(device) {

    writeQueue = writeQueue.then(async () => {

        const devices = await readDevices();

        const index = devices.findIndex(
            d => d.deviceId === device.deviceId
        );

        device.lastSeen = new Date().toISOString();

        if (index !== -1) {

            devices[index] = device;

        }
        else {

            devices.push(device);

        }

        await writeDevices(devices);

    });

    return writeQueue;

}

/**
 * Get one device.
 */
/**
 * Get one device.
 */
export async function getDevice(deviceId) {

    await writeQueue;

    const devices = await readDevices();

    const device = devices.find(
        d => d.deviceId === deviceId
    );

    return device
        ? withOnlineStatus(device)
        : null;

}

/**
 * Get all devices.
 */
/**
 * Get all devices.
 */
export async function getAllDevices() {

    await writeQueue;

    const devices = await readDevices();

    return devices.map(withOnlineStatus);

}