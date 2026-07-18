import express from "express";

import { getAllDevices } from "../store/deviceStore.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const devices = await getAllDevices();

        res.status(200).json(devices);

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to retrieve systems."
        });

    }

});

export default router;