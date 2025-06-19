const {
  createRequestService,
  getRequestService,
  updateRequestService,
  STATUS,
} = require("../services/requestService");
const Statistics = require("../models/Statistics");

// Create a new request
const createRequest = async (req, res) => {
  try {
    const { ownerId, accountNumber, bankName, accountHolderName, amount } =
      req.body;
    const newRequest = await createRequestService({
      ownerId,
      accountNumber,
      bankName,
      accountHolderName,
      amount,
    });
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get requests (optionally filter by ownerId or status)
const getRequests = async (req, res) => {
  try {
    const { ownerId, status } = req.query;
    const filter = {};
    if (ownerId) filter.ownerId = ownerId;
    if (status) filter.status = status;
    const requests = await getRequestService(filter);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update request status or other fields
const updateRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, ...updateData } = req.body;
    if (status && !Object.values(STATUS).includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Get the original request to check its current status
    const originalRequest = await getRequestService({ _id: requestId });
    if (!originalRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (status) updateData.status = status;
    const updatedRequest = await updateRequestService(requestId, updateData);
    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    // If request was approved, update the owner's statistics
    if (status === STATUS.APPROVE) {
      try {
        // Use upsert to create statistics record if it doesn't exist
        await Statistics.findOneAndUpdate(
          { ownerId: updatedRequest.ownerId },
          {
            $inc: { totalPayout: updatedRequest.amount },
            lastUpdated: new Date(),
          },
          { upsert: true, new: true }
        );

        console.log(
          `Updated totalPayout for owner ${updatedRequest.ownerId}: +${updatedRequest.amount}`
        );
      } catch (statsError) {
        console.error("Error updating statistics:", statsError);
        // Don't fail the request update if statistics update fails
      }
    }

    // If request was denied and was previously approved, subtract the amount
    if (status === STATUS.DENINE && originalRequest.status === STATUS.APPROVE) {
      try {
        await Statistics.findOneAndUpdate(
          { ownerId: updatedRequest.ownerId },
          {
            $inc: { totalPayout: -updatedRequest.amount },
            lastUpdated: new Date(),
          },
          { upsert: true, new: true }
        );

        console.log(
          `Reverted totalPayout for owner ${updatedRequest.ownerId}: -${updatedRequest.amount}`
        );
      } catch (statsError) {
        console.error(
          "Error updating statistics for denied request:",
          statsError
        );
        // Don't fail the request update if statistics update fails
      }
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequest,
  getRequests,
  updateRequest,
};
