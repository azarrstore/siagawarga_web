import { useMemo, useState } from "react";
import RegionGate from "../components/RegionGate";
import CheckinForm from "../components/CheckinForm";

export default function Citizen() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const fromUrl = params.get("kode") || "";
  const [regionCode, setRegionCode] = useState(fromUrl);

  if (!regionCode) {
    return <RegionGate mode="citizen" onReady={({ regionCode }) => setRegionCode(regionCode)} />;
  }

  return <CheckinForm regionCode={regionCode} />;
}
