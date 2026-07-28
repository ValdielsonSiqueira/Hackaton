import React, { useState, useRef } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  LayoutChangeEvent 
} from "react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";
import type { MobileTaskItem, TaskStep } from "../context/AppContext";
import { SpotlightCutoutTour, SpotlightStep } from "../components/SpotlightCutoutTour";
import { CreateTaskModalMobile } from "../components/CreateTaskModalMobile";
import { DeleteTaskModalMobile } from "../components/DeleteTaskModalMobile";
import { 
  Plus, 
  Volume2, 
  Trash2, 
  Pencil, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Bell, 
  Compass 
} from "lucide-react-native";

interface TasksViewProps {
  theme: { colors: MobileThemeColors; fontScale: number };
  activityTasks: MobileTaskItem[];
  addActivityTask: (task: MobileTaskItem) => Promise<void>;
  updateActivityTask: (task: MobileTaskItem) => Promise<void>;
  toggleActivityTask: (id: string) => Promise<void>;
  toggleActivityStep: (taskId: string, stepId: number) => Promise<void>;
  deleteActivityTask: (id: string) => Promise<void>;
  speakText: (text: string) => void;
  triggerToast: (msg: string) => void;
  bottomInset?: number;
}

export const TasksView: React.FC<TasksViewProps> = ({
  theme,
  activityTasks,
  addActivityTask,
  updateActivityTask,
  toggleActivityTask,
  toggleActivityStep,
  deleteActivityTask,
  speakText,
  triggerToast,
  bottomInset = 0,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors, fontScale } = theme;
  const isHighContrast = colors.mode === "high";
  const primaryAccentColor = isHighContrast ? colors.primary : "#0F62FE";

  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<MobileTaskItem | null>(null);
  const [deleteModalTask, setDeleteModalTask] = useState<MobileTaskItem | null>(null);

  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<string, boolean>>({});
  const [showTasksTour, setShowTasksTour] = useState(false);

  const [headerY, setHeaderY] = useState(0);
  const [progressCardY, setProgressCardY] = useState(150);
  const [taskListY, setTaskListY] = useState(350);

  const totalCount = activityTasks.length;
  const completedCount = activityTasks.filter((t) => t.done).length;
  const pendingCount = activityTasks.filter((t) => !t.done).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTasks = activityTasks.filter((t) => {
    if (filter === "pending") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const tasksTourSteps: SpotlightStep[] = [
    {
      id: "tasks-step-1",
      targetName: "Cabeçalho de Atividades e Nova Atividade",
      title: "1/3 Nova Atividade Acadêmica",
      description: "Toque em + Nova Atividade para cadastrar uma nova tarefa acadêmica com título, prioridade e passos guiados.",
      voiceText: "Para cadastrar novas atividades, clique no botão azul Nova Atividade.",
      tip: "Você também pode editar tarefas existentes no ícone de lápis.",
      scrollY: headerY,
    },
    {
      id: "tasks-step-2",
      targetName: "Barra de Progresso do Dia",
      title: "2/3 Acompanhamento de Progresso",
      description: "Veja o percentual de atividades concluídas no dia com a barra de progresso visual.",
      voiceText: "Esta barra mostra a porcentagem de tarefas já concluídas hoje.",
      tip: "À medida que conclui passos, a barra avança automaticamente.",
      scrollY: progressCardY,
    },
    {
      id: "tasks-step-3",
      targetName: "Filtros e Lista Detalhada",
      title: "3/3 Lista Detalhada de Atividades",
      description: "Filtre por Todas, Pendentes ou Concluídas. Clique para marcar, expandir passos ou excluir.",
      voiceText: "Aqui estão todas as suas tarefas. Você pode filtrar a lista e expandir o passo a passo.",
      tip: "O ícone de alto-falante lê a instrução em voz alta.",
      scrollY: taskListY,
    },
  ];

  const toggleExpand = (id: string) => {
    setExpandedTaskIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConfirmDelete = async (taskId: string) => {
    await deleteActivityTask(taskId);
    setDeleteModalTask(null);
    triggerToast("🗑️ Atividade excluída permanentemente!");
  };

  const handleStepChange = (_stepIndex: number, scrollY: number) => {
    scrollViewRef.current?.scrollTo({
      y: Math.max(0, scrollY - 10),
      animated: true,
    });
  };

  const getPriorityBorderColor = (task: MobileTaskItem) => {
    if (task.done) return colors.success;
    if (task.priority === "high") return colors.urgent;
    if (task.priority === "medium") return "#F1C21B";
    return colors.success;
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={[styles.container, { paddingBottom: 90 + bottomInset }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Title Header (Replicating Web TasksHeader.tsx 1:1) */}
      <View
        style={styles.headerBlock}
        onLayout={(e: LayoutChangeEvent) => setHeaderY(e.nativeEvent.layout.y)}
      >
        <View style={styles.titleRowMobile}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.text, fontSize: Math.round(22 * fontScale) }]}>
              Minhas Atividades e Trabalhos
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted, fontSize: Math.round(13 * fontScale) }]}>
              Acompanhe suas leituras e prazos de forma simples e acessível
            </Text>
          </View>
        </View>

        {/* Buttons Row (Matching Web TasksHeader 1:1) */}
        <View style={styles.headerBtnsRow}>
          <TouchableOpacity
            style={[styles.tourBtnWeb, { borderColor: isHighContrast ? colors.border : "#E0E0E0", backgroundColor: colors.card }]}
            onPress={() => setShowTasksTour(true)}
          >
            <Compass size={Math.round(20 * fontScale)} color={primaryAccentColor} />
            <Text style={[styles.tourBtnWebText, { color: colors.text, fontSize: Math.round(16 * fontScale) }]}>
              Tour Guiado
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.newTaskBtnWeb, { backgroundColor: primaryAccentColor }]}
            onPress={() => {
              setEditingTask(null);
              setCreateModalVisible(true);
            }}
          >
            <Plus size={Math.round(20 * fontScale)} color={colors.primaryContrast} />
            <Text style={[styles.newTaskBtnWebText, { color: colors.primaryContrast, fontSize: Math.round(16 * fontScale) }]}>
              Nova Atividade
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Card (Replicating Web TasksProgress.tsx 1:1) */}
      <View
        style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}
        onLayout={(e: LayoutChangeEvent) => setProgressCardY(e.nativeEvent.layout.y)}
      >
        <View style={styles.progressHeaderRow}>
          <Text style={[styles.progressTitleText, { color: colors.text, fontSize: Math.round(15 * fontScale) }]}>
            Progresso do Dia
          </Text>
          <Text style={[styles.progressSubText, { color: primaryAccentColor, fontSize: Math.round(13 * fontScale) }]}>
            {completedCount} de {totalCount} concluídas ({progressPercent}%)
          </Text>
        </View>
        <View style={[styles.progressBarTrack, { backgroundColor: colors.surfaceSubtle }]}>
          <View style={[styles.progressBarFill, { backgroundColor: colors.success, width: `${progressPercent}%` }]} />
        </View>
      </View>

      {/* Filter Tabs (Replicating Web TaskFilterTabs.tsx 1:1) */}
      <View style={[styles.filterTabsContainer, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "all" && [styles.filterTabActive, { backgroundColor: colors.card, borderBottomColor: primaryAccentColor }],
          ]}
          onPress={() => setFilter("all")}
        >
          <Text style={[styles.filterTabText, { color: filter === "all" ? primaryAccentColor : colors.textMuted, fontSize: Math.round(13 * fontScale) }]}>
            Todas ({totalCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "pending" && [styles.filterTabActive, { backgroundColor: colors.card, borderBottomColor: primaryAccentColor }],
          ]}
          onPress={() => setFilter("pending")}
        >
          <Text style={[styles.filterTabText, { color: filter === "pending" ? primaryAccentColor : colors.textMuted, fontSize: Math.round(13 * fontScale) }]}>
            Pendentes ({pendingCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "done" && [styles.filterTabActive, { backgroundColor: colors.card, borderBottomColor: primaryAccentColor }],
          ]}
          onPress={() => setFilter("done")}
        >
          <Text style={[styles.filterTabText, { color: filter === "done" ? primaryAccentColor : colors.textMuted, fontSize: Math.round(13 * fontScale) }]}>
            Concluídas ({completedCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Task Items List (Replicating Web TaskCard.tsx 1:1) */}
      <View onLayout={(e: LayoutChangeEvent) => setTaskListY(e.nativeEvent.layout.y)}>
        {filteredTasks.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: colors.borderWidth }]}>
            <Text style={[styles.emptyText, { color: colors.textMuted, fontSize: Math.round(14 * fontScale) }]}>
              Nenhuma atividade cadastrada neste filtro.
            </Text>
          </View>
        ) : (
          filteredTasks.map((t) => {
            const isExpanded = !!expandedTaskIds[t.id];
            const priorityBorderColor = getPriorityBorderColor(t);

            return (
              <View
                key={t.id}
                style={[
                  styles.taskCardWeb,
                  { 
                    backgroundColor: colors.card, 
                    borderColor: colors.border, 
                    borderWidth: colors.borderWidth,
                    borderLeftWidth: 4,
                    borderLeftColor: priorityBorderColor,
                  },
                ]}
              >
                {/* Task Main Stacked Container */}
                <View style={styles.taskCardMainRow}>
                  {/* Top Bar: Checkbox on Left, Action Icons on Right */}
                  <View style={styles.taskCardTopBar}>
                    <TouchableOpacity
                      style={[
                        styles.squareCheckbox,
                        { 
                          backgroundColor: t.done ? colors.success : colors.card, 
                          borderColor: t.done ? colors.success : colors.border, 
                        },
                      ]}
                      onPress={() => toggleActivityTask(t.id)}
                    >
                      {t.done && <Text style={styles.checkmarkText}>✓</Text>}
                    </TouchableOpacity>

                    {/* Actions Group (Pencil, Trash, Chevron) */}
                    <View style={styles.actionsColumnWeb}>
                      <TouchableOpacity
                        style={styles.actionIconBtn}
                        onPress={() => {
                          setEditingTask(t);
                          setCreateModalVisible(true);
                        }}
                      >
                        <Pencil size={Math.min(26, Math.round(18 * fontScale))} color={colors.textMuted} />
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.actionIconBtn} onPress={() => setDeleteModalTask(t)}>
                        <Trash2 size={Math.min(26, Math.round(18 * fontScale))} color={colors.urgent} />
                      </TouchableOpacity>

                      {t.steps && t.steps.length > 0 && (
                        <TouchableOpacity style={styles.actionIconBtn} onPress={() => toggleExpand(t.id)}>
                          {isExpanded ? <ChevronUp size={Math.min(28, Math.round(20 * fontScale))} color={colors.textMuted} /> : <ChevronDown size={Math.min(28, Math.round(20 * fontScale))} color={colors.textMuted} />}
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Bottom Main Content Area: 100% width for clean word wrapping */}
                  <View style={styles.taskCardContentBox}>
                    <Text style={[styles.taskTitleWeb, { color: colors.text, fontSize: Math.round(17 * fontScale), textDecorationLine: t.done ? "line-through" : "none" }]}>
                      {t.title}
                    </Text>

                    {/* Badges Row Below Title (Matching Web 1:1) */}
                    <View style={styles.badgesRowWeb}>
                      <View style={[styles.categoryBadgeWeb, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
                        <Text style={[styles.categoryBadgeTextWeb, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
                          {t.category}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.priorityBadgeWeb,
                          { 
                            backgroundColor: t.done 
                              ? colors.success 
                              : (t.priority === "high" ? colors.urgent : t.priority === "medium" ? "#F1C21B" : colors.success),
                          },
                        ]}
                      >
                        <Text style={[styles.priorityBadgeTextWeb, { color: t.done || t.priority === "high" || t.priority === "low" ? "#FFFFFF" : "#161616", fontSize: Math.round(12 * fontScale) }]}>
                          {t.priority === "high" ? "Urgente" : t.priority === "medium" ? "Média" : "Baixa"}
                        </Text>
                      </View>

                      <Text style={[styles.dueTextWeb, { color: t.priority === "high" ? colors.urgent : colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
                        {t.due}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Expanded Step Checklist (Matching Web TaskCard 1:1) */}
                {t.steps && t.steps.length > 0 && isExpanded && (
                  <View style={[styles.expandedStepsRegion, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
                    <View style={styles.stepRegionHeader}>
                      <Sparkles size={16} color={primaryAccentColor} />
                      <Text style={[styles.stepRegionHeaderText, { color: colors.textMuted, fontSize: Math.round(12 * fontScale) }]}>
                        PASSO A PASSO COM LEITURA POR VOZ
                      </Text>
                    </View>

                    {t.steps.map((st: TaskStep) => (
                      <View key={st.id} style={[styles.stepCardItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.stepCardTopBar}>
                          <TouchableOpacity
                            style={[styles.stepNumberBadge, { backgroundColor: st.done ? colors.success : primaryAccentColor }]}
                            onPress={() => toggleActivityStep(t.id, st.id)}
                          >
                            <Text style={[styles.stepNumberText, { fontSize: Math.round(14 * fontScale) }]}>{st.id}</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.stepAudioBtnCircle, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
                            onPress={() => {
                              speakText(st.text);
                              triggerToast("🔊 Lendo instrução em voz alta...");
                            }}
                          >
                            <Volume2 size={Math.min(24, Math.round(16 * fontScale))} color={primaryAccentColor} />
                          </TouchableOpacity>
                        </View>

                        <Text style={[styles.stepDescriptionText, { color: colors.text, fontSize: Math.round(15 * fontScale), textDecorationLine: st.done ? "line-through" : "none" }]}>
                          {st.text}
                        </Text>
                      </View>
                    ))}

                    <View style={styles.reminderRowFooter}>
                      <TouchableOpacity
                        style={[styles.reminderBtnOutline, { borderColor: colors.border, backgroundColor: colors.card }]}
                        onPress={() => triggerToast(`Lembrete ativado para ${t.title}`)}
                      >
                        <Bell size={14} color={colors.text} />
                        <Text style={[styles.reminderBtnText, { color: colors.text, fontSize: Math.round(12 * fontScale) }]}>
                          Definir lembrete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>

      {/* Create / Edit Task Modal */}
      <CreateTaskModalMobile
        visible={createModalVisible}
        theme={theme}
        editingTask={editingTask}
        onClose={() => setCreateModalVisible(false)}
        onSaveTask={async (taskData) => {
          if (editingTask) {
            const updatedTask: MobileTaskItem = {
              ...editingTask,
              title: taskData.title,
              category: taskData.category,
              due: taskData.due,
              priority: taskData.priority,
              steps: taskData.steps,
            };
            await updateActivityTask(updatedTask);
            triggerToast("✨ Atividade atualizada com sucesso!");
          } else {
            const newTask: MobileTaskItem = {
              id: `act-${Date.now()}`,
              title: taskData.title,
              category: taskData.category,
              due: taskData.due,
              done: false,
              priority: taskData.priority,
              steps: taskData.steps,
            };
            await addActivityTask(newTask);
            triggerToast("✨ Atividade criada com sucesso!");
          }
        }}
        triggerToast={triggerToast}
        speakText={speakText}
      />

      {/* Delete Task Modal */}
      <DeleteTaskModalMobile
        task={deleteModalTask}
        visible={!!deleteModalTask}
        theme={theme}
        onClose={() => setDeleteModalTask(null)}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* Spotlight Tour for Tasks Page */}
      <SpotlightCutoutTour
        visible={showTasksTour}
        theme={theme}
        steps={tasksTourSteps}
        onClose={() => setShowTasksTour(false)}
        speakText={speakText}
        onStepChange={handleStepChange}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  headerBlock: {
    gap: 12,
  },
  titleRowMobile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 2,
    lineHeight: 18,
  },
  headerBtnsRow: {
    flexDirection: "column",
    width: "100%",
    gap: 12,
  },
  tourBtnWeb: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderRadius: 10,
    flexWrap: "wrap",
  },
  tourBtnWebText: {
    fontWeight: "600",
    textAlign: "center",
    flexShrink: 1,
  },
  newTaskBtnWeb: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    minHeight: 58,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 10,
    flexWrap: "wrap",
  },
  newTaskBtnWebText: {
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
  progressCard: {
    padding: 16,
    borderRadius: 10,
    gap: 12,
  },
  progressHeaderRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 6,
  },
  progressTitleText: {
    fontWeight: "bold",
    flexShrink: 1,
    flexWrap: "wrap",
    width: "100%",
  },
  progressSubText: {
    fontWeight: "bold",
    flexShrink: 1,
    flexWrap: "wrap",
    width: "100%",
  },
  progressBarTrack: {
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
  },
  filterTabsContainer: {
    flexDirection: "column",
    borderRadius: 12,
    padding: 8,
    gap: 8,
  },
  filterTab: {
    width: "100%",
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexWrap: "wrap",
  },
  filterTabActive: {
    borderBottomWidth: 3,
  },
  filterTabText: {
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  emptyCard: {
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  emptyText: {
    fontWeight: "500",
  },
  taskCardWeb: {
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
  taskCardMainRow: {
    flexDirection: "column",
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 14,
  },
  taskCardTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  taskCardContentBox: {
    width: "100%",
    gap: 8,
  },
  squareCheckbox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  taskTitleWeb: {
    fontWeight: "600",
    flexShrink: 1,
    flexWrap: "wrap",
    width: "100%",
  },
  badgesRowWeb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
    flexWrap: "wrap",
  },
  categoryBadgeWeb: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryBadgeTextWeb: {
    fontWeight: "bold",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  priorityBadgeWeb: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityBadgeTextWeb: {
    fontWeight: "bold",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  dueTextWeb: {
    fontWeight: "bold",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  actionsColumnWeb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionIconBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  expandedStepsRegion: {
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  stepRegionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
    flexWrap: "wrap",
  },
  stepRegionHeaderText: {
    fontWeight: "bold",
    letterSpacing: 0.5,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  stepCardItem: {
    flexDirection: "column",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
  },
  stepCardTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  stepNumberBadge: {
    minWidth: 36,
    minHeight: 36,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  stepDescriptionText: {
    width: "100%",
    flexShrink: 1,
    flexWrap: "wrap",
    fontWeight: "500",
  },
  stepAudioBtnCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  reminderRowFooter: {
    alignItems: "flex-end",
    marginTop: 6,
  },
  reminderBtnOutline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  reminderBtnText: {
    fontWeight: "600",
  },
});
