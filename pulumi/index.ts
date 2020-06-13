import { k8sCluster, k8sProvider } from "./cluster";

export let cluster = k8sCluster.name;
export let kubeConfig = k8sCluster.kubeConfigRaw;
