import projectModel from "../../models/project.model.js";

export const joinProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await projectModel.findById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const isMember = project.members.some(
      (m) => m.user.toString() === req.user._id.toString(),
    );
    if (isMember) {
      return res
        .status(400)
        .json({ success: false, message: "Already a member" });
    }

    project.members.push({ user: req.user._id, role: "editor" });
    await project.save();

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const leaveProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await projectModel.findById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    if (project.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Owners cannot leave. Transfer ownership or delete project.",
      });
    }

    project.members = project.members.filter(
      (m) => m.user.toString() !== req.user._id.toString(),
    );
    await project.save();

    res
      .status(200)
      .json({ success: true, message: "Left project successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const requestJoin = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await projectModel.findById(projectId);

    if (!project.requests.includes(req.user._id)) {
      project.requests.push(req.user._id);
      await project.save();
    }

    res.status(200).json({ success: true, message: "Join request sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelJoin = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await projectModel.findById(projectId);

    project.requests = project.requests.filter(
      (id) => id.toString() !== req.user._id.toString(),
    );
    await project.save();

    res.status(200).json({ success: true, message: "Join request cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { userId } = req.body;

    req.project.members = req.project.members.filter(
      (m) => m.user.toString() !== userId,
    );

    if (!req.project.blockedUsers.includes(userId)) {
      req.project.blockedUsers.push(userId);
    }

    await req.project.save();
    res
      .status(200)
      .json({ success: true, message: "User blocked from project" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const unblockUser = async (req, res) => {
  try {
    const { userId } = req.body;

    req.project.blockedUsers = req.project.blockedUsers.filter(
      (id) => id.toString() !== userId,
    );

    await req.project.save();
    res.status(200).json({ success: true, message: "User unblocked" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const acceptJoin = async (req, res) => {
  try {
    const { userId } = req.body;

    req.project.requests = req.project.requests.filter(
      (id) => id.toString() !== userId,
    );

    const alreadyMember = req.project.members.some(
      (m) => m.user.toString() === userId,
    );
    if (!alreadyMember) {
      req.project.members.push({ user: userId, role: "editor" });
    }

    await req.project.save();
    res.status(200).json({ success: true, message: "Join request accepted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectJoin = async (req, res) => {
  try {
    const { userId } = req.body;

    req.project.requests = req.project.requests.filter(
      (id) => id.toString() !== userId,
    );

    await req.project.save();
    res.status(200).json({ success: true, message: "Join request rejected" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllMembers = async (req, res) => {
  try {
    const project = await req.project.populate(
      "members.user",
      "name email photo",
    );

    res.status(200).json({
      success: true,
      data: project.members,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getPendingMembers = async (req, res) => {
  try {
    const project = await req.project.populate("requests", "name email photo");

    res.status(200).json({
      success: true,
      data: project.requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlockedMembers = async (req, res) => {
  try {
    const project = await req.project.populate(
      "blockedUsers",
      "name email photo",
    );

    res.status(200).json({
      success: true,
      data: project.blockedUsers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addMembers = async (req, res) => {
  try {
    const { email, role } = req.body;

    const userToAdd = await userModel.findOne({ email });
    if (!userToAdd) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isAlreadyMember = req.project.members.some(
      (m) => m.user.toString() === userToAdd._id.toString(),
    );

    if (isAlreadyMember) {
      return res
        .status(400)
        .json({ success: false, message: "User is already a member" });
    }

    req.project.members.push({ user: userToAdd._id, role: role || "editor" });
    await req.project.save();

    res
      .status(200)
      .json({ success: true, message: "Member added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeMembers = async (req, res) => {
  try {
    const { userId } = req.body;

    if (userId === req.project.owner.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "Owner cannot be removed" });
    }

    req.project.members = req.project.members.filter(
      (m) => m.user.toString() !== userId,
    );

    await req.project.save();
    res
      .status(200)
      .json({ success: true, message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changeRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    const member = req.project.members.find(
      (m) => m.user.toString() === userId,
    );

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found in project" });
    }

    member.role = newRole;
    await req.project.save();

    res
      .status(200)
      .json({ success: true, message: "Role updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
