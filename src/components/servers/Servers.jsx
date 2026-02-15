/* eslint-disable react/prop-types */
import {
  faClosedCaptioning,
  faFile,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BouncingLoader from "../ui/bouncingloader/Bouncingloader";
import "./Servers.css";
import { useEffect } from "react";

function Servers({
  servers,
  activeEpisodeNum,
  activeServerId,
  setActiveServerId,
  serverLoading,
  setActiveServerType,
  setActiveServerName,
}) {
  const subServers =
    servers?.filter((server) => server.type === "sub") || [];
  const dubServers =
    servers?.filter((server) => server.type === "dub") || [];
  const rawServers =
    servers?.filter((server) => server.type === "raw") || [];

  useEffect(() => {
    const savedServerName = localStorage.getItem("server_name");
    if (savedServerName) {
      const matchingServer = servers?.find(
        (server) => server.serverName === savedServerName,
      );

      if (matchingServer) {
        setActiveServerId(matchingServer.data_id);
        setActiveServerType(matchingServer.type);
      } else if (servers && servers.length > 0) {
        const defaultServer = servers.find(s => s.serverName === "HD-2") || servers[0];
        setActiveServerId(defaultServer.data_id);
        setActiveServerType(defaultServer.type);
      }
    } else if (servers && servers.length > 0) {
      const defaultServer = servers.find(s => s.serverName === "HD-2") || servers[0];
      setActiveServerId(defaultServer.data_id);
      setActiveServerType(defaultServer.type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servers]);

  const handleServerSelect = (server) => {
    setActiveServerId(server.data_id);
    setActiveServerType(server.type);
    setActiveServerName(server.serverName);
    localStorage.setItem("server_name", server.serverName);
    localStorage.setItem("server_type", server.type);
  };

  return (
    <div className="relative bg-[#111111] p-4 w-full min-h-[100px] flex justify-center items-center max-[1200px]:bg-[#151515] max-[600px]:p-2">
      {serverLoading ? (
        <div className="w-full h-full rounded-lg flex justify-center items-center max-[600px]:rounded-none">
          <BouncingLoader />
        </div>
      ) : servers ? (
        <div className="w-full h-full rounded-lg grid grid-cols-[minmax(0,30%),minmax(0,70%)] overflow-hidden max-[800px]:grid-cols-[minmax(0,40%),minmax(0,60%)] max-[600px]:flex max-[600px]:flex-col max-[600px]:rounded-none max-[600px]:gap-2">
          <div className="h-full bg-[#e0e0e0] px-6 text-black flex flex-col justify-center items-center gap-y-2 max-[600px]:bg-transparent max-[600px]:h-auto max-[600px]:text-white max-[600px]:py-1 max-[600px]:px-2">
            <p className="text-center leading-5 font-medium text-[14px] max-[600px]:text-[13px] max-[600px]:mb-0">
              You are watching:{" "}
              <br className="max-[600px]:hidden" />
              <span className="font-semibold max-[600px]:text-[#e0e0e0] max-[600px]:ml-1">
                Episode {activeEpisodeNum}
              </span>
            </p>
            <p className="leading-5 text-[14px] font-medium text-center max-[600px]:text-[12px] max-[600px]:hidden">
              If the current server doesn&apos;t work, please try other servers
              beside.
            </p>
          </div>
          <div className="bg-[#1f1f1f] flex flex-col max-[600px]:rounded-lg max-[600px]:p-2">
            {rawServers.length > 0 && (
              <div className={`servers px-2 flex items-center flex-wrap gap-y-1 ml-2 max-[600px]:py-1.5 max-[600px]:px-1 max-[600px]:ml-0 ${dubServers.length === 0 || subServers.length === 0
                  ? "h-1/2"
                  : "h-full"
                }`}>
                <div className="flex items-center gap-x-2 min-w-[65px]">
                  <FontAwesomeIcon
                    icon={faFile}
                    className="text-[#e0e0e0] text-[13px]"
                  />
                  <p className="font-bold text-[14px] max-[600px]:text-[12px]">RAW:</p>
                </div>
                <div className="flex gap-1.5 ml-2 flex-wrap max-[600px]:ml-0">
                  {rawServers.map((item, index) => (
                    <div
                      key={index}
                      className={`px-6 py-[5px] rounded-lg cursor-pointer ${activeServerId === item?.data_id
                          ? "bg-[#e0e0e0] text-black"
                          : "bg-[#373737] text-white"
                        } max-[700px]:px-3 max-[600px]:px-2 max-[600px]:py-1`}
                      onClick={() => handleServerSelect(item)}
                    >
                      <p className="text-[13px] font-semibold max-[600px]:text-[12px]">
                        {item.serverName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {subServers.length > 0 && (
              <div className={`servers px-2 flex items-center flex-wrap gap-y-1 ml-2 max-[600px]:py-1.5 max-[600px]:px-1 max-[600px]:ml-0 ${dubServers.length === 0 ? "h-1/2" : "h-full"
                }`}>
                <div className="flex items-center gap-x-2 min-w-[65px]">
                  <FontAwesomeIcon
                    icon={faClosedCaptioning}
                    className="text-[#e0e0e0] text-[13px]"
                  />
                  <p className="font-bold text-[14px] max-[600px]:text-[12px]">SUB:</p>
                </div>
                <div className="flex gap-1.5 ml-2 flex-wrap max-[600px]:ml-0">
                  {subServers.map((item, index) => (
                    <div
                      key={index}
                      className={`px-6 py-[5px] rounded-lg cursor-pointer ${activeServerId === item?.data_id
                          ? "bg-[#e0e0e0] text-black"
                          : "bg-[#373737] text-white"
                        } max-[700px]:px-3 max-[600px]:px-2 max-[600px]:py-1`}
                      onClick={() => handleServerSelect(item)}
                    >
                      <p className="text-[13px] font-semibold max-[600px]:text-[12px]">
                        {item.serverName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {dubServers.length > 0 && (
              <div className={`servers px-2 flex items-center flex-wrap gap-y-1 ml-2 max-[600px]:py-1.5 max-[600px]:px-1 max-[600px]:ml-0 ${subServers.length === 0 ? "h-1/2" : "h-full"
                }`}>
                <div className="flex items-center gap-x-2 min-w-[65px]">
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    className="text-[#e0e0e0] text-[13px]"
                  />
                  <p className="font-bold text-[14px] max-[600px]:text-[12px]">DUB:</p>
                </div>
                <div className="flex gap-1.5 ml-2 flex-wrap max-[600px]:ml-0">
                  {dubServers.map((item, index) => (
                    <div
                      key={index}
                      className={`px-6 py-[5px] rounded-lg cursor-pointer ${activeServerId === item?.data_id
                          ? "bg-[#e0e0e0] text-black"
                          : "bg-[#373737] text-white"
                        } max-[700px]:px-3 max-[600px]:px-2 max-[600px]:py-1`}
                      onClick={() => handleServerSelect(item)}
                    >
                      <p className="text-[13px] font-semibold max-[600px]:text-[12px]">
                        {item.serverName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center font-medium text-[15px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          Could not load servers <br />
          Either reload or try again after sometime
        </p>
      )}
    </div>
  );
}

export default Servers;
