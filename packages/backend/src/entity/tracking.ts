import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Task} from "./task";

@Entity()
export class Tracking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: "text", nullable: true})
    description: string;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    startTime: string;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    endTime: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @ManyToOne(() => Task, (task: Task) => task.trackings, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    task: Task;
}