 const columns =[
  {
    name: "name",
    id: "name"
  },
  {
    name: "execId",
    id: "id",
    isShow: false
  },
  {
    name: "命令",
    id: "cmd",
    support: {
      edit: {
        type: "text"
      }
    }
  },
  {
    name: "类型",
    id: "type"
  },
  {
    name: "是否成功",
    id: "success",
    support: {
      edit: {
        type: "text"
      }
    }
  },
  {
    name: "groupname",
    id: "groupname"
  },
  {
    name: "hostId",
    id: "hostId"
  },
  {
    name: "exitStatus",
    id: "exitStatus",
    support: {
      edit: {
        type: "text"
      }
    }
  },
  {
    name: "errMsg",
    id: "errMsg",
    support: {
      edit: {
        type: "text"
      }
    }
  },
  {
    name: "执行记录",
    queryType: "title",
    support: {
      edit: {}
    }
  },
  {
    name: "执行记录",
    queryType: "slot",
    slotName: "execLines",
    support: {
      edit: {}
    }
  },
  {
    name: "主机信息",
    queryType: "title",
    support: {
      edit: {
        show: row => row.type !== "ssh"
      }
    }
  },
  {
    name: "主机信息",
    queryType: "slot",
    slotName: "hosts",
    support: {
      edit: {
        show: row => row.type !== "ssh"
      }
    }
  }
]

export default columns